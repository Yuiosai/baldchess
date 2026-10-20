"""HTTP regression tests: room codes, rejoining, host substitute and 1v1."""
import json
import tempfile
import threading
import time
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class RoomTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.previous_data = server.DATA
        server.DATA = Path(self.temp.name) / 'rooms.json'
        server.ROOMS.clear()
        with server.RATE_LOCK: server.RATE_LOG.clear()
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.base = 'http://127.0.0.1:' + str(self.http.server_port)

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join(timeout=3)
        server.ROOMS.clear()
        server.DATA = self.previous_data
        self.temp.cleanup()

    def call(self, route, data=None, token=None):
        req = Request(self.base + route, data=None if data is None else json.dumps(data).encode('utf-8'),
                      headers={'Content-Type': 'application/json', **({'X-BaldChess-Token':token} if token else {})})
        with urlopen(req, timeout=4) as response:
            return json.load(response)

    def test_duel_join_reconnect_and_host_takeover(self):
        created = self.call('/api/rooms', {'options': {'mode': 'duel'}, 'name': 'Alice'})
        code, host = created['code'], created['token']
        self.assertEqual(len(code), 6)
        self.assertEqual(created['room']['role'], 'red')
        self.assertEqual(created['room']['state']['status'], 'waiting')
        bob = self.call('/api/rooms/' + code + '/join', {'name': 'Bob'})
        other = bob['token']
        self.assertEqual(bob['room']['role'], 'yellow')
        self.assertEqual(bob['room']['joined'], 2)
        self.assertEqual(bob['room']['state']['status'], 'playing')
        self.assertEqual(len(bob['room']['state']['board']), 8)
        self.assertEqual(self.call('/api/rooms/' + code, token=other)['role'], 'yellow')
        self.assertEqual(self.call('/api/rooms/' + code + '/join', {'token': other})['token'], other)
        self.call('/api/rooms/' + code + '/move', {'token': host, 'from': [6, 4], 'to': [4, 4]})
        with self.assertRaises(HTTPError) as ctx:
            self.call('/api/rooms/' + code + '/takeover', {'token': host, 'target': 'yellow'})
        self.assertEqual(ctx.exception.code, 400)
        with server.LOCK:
            server.ROOMS[code]['last_seen']['yellow'] = time.time() - 30
        takeover = self.call('/api/rooms/' + code + '/takeover', {'token': host, 'target': 'yellow'})
        self.assertIn('yellow', takeover['room']['host_controls'])
        moved = self.call('/api/rooms/' + code + '/move', {'token': host, 'from': [1, 4], 'to': [3, 4]})
        self.assertEqual(moved['room']['state']['turn'], 'red')
        reconnected = self.call('/api/rooms/' + code + '/join', {'token': other})
        self.assertNotIn('yellow', reconnected['room']['host_controls'])

    def test_four_player_code_room(self):
        made = self.call('/api/rooms', {'options': {'mode': 'four', 'variant': 'fischer'}})
        code = made['code']
        self.assertNotIn('tokens', made['room'])
        for name, color in [('Player 2', 'blue'), ('Player 3', 'yellow'), ('Player 4', 'green')]:
            joined = self.call('/api/rooms/' + code + '/join', {'name': name})
            self.assertEqual(joined['room']['role'], color)
        self.assertEqual(joined['room']['state']['status'], 'playing')
        board = joined['room']['state']['board']
        self.assertEqual(len(board), 14)
        from engine import home_square
        orders = [[board[r][c]['type'] for i in range(8) for r,c in [home_square(col,i)]] for col in server.COLORS]
        self.assertTrue(all(a==orders[0] for a in orders))
        host = made['token']
        with server.LOCK:
            for color in ('blue', 'yellow', 'green'):
                server.ROOMS[code]['last_seen'][color] = time.time() - 30
        for color in ('blue', 'yellow', 'green'):
            taken = self.call('/api/rooms/' + code + '/takeover', {'token': host, 'target': color})
            self.assertIn(color, taken['room']['host_controls'])
        self.assertEqual(len(taken['room']['host_controls']), 3)
        for start, end in [([12, 4], [10, 4]), ([3, 1], [3, 3]), ([1, 5], [3, 5]), ([5, 12], [5, 10])]:
            self.call('/api/rooms/' + code + '/move', {'token': host, 'from': start, 'to': end})
        self.assertEqual(self.call('/api/rooms/' + code)['state']['turn'], 'red')


if __name__ == '__main__':
    unittest.main()
