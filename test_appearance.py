"""Appearance is per seat, transmitted over the room API, validated on server."""
import json
import tempfile
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen
import server

class AppearanceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.old = server.DATA
        server.DATA = Path(self.temp.name) / 'rooms.json'
        server.ROOMS.clear()
        with server.RATE_LOCK: server.RATE_LOG.clear()
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        self.worker = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.worker.start()
        self.base = f'http://127.0.0.1:{self.http.server_port}'

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.worker.join(timeout=3)
        server.ROOMS.clear()
        server.DATA = self.old
        self.temp.cleanup()

    def req(self, path, data=None, token=None):
        req = Request(self.base+path,
                      data=None if data is None else json.dumps(data).encode(),
                      headers={'Content-Type': 'application/json', **({'X-BaldChess-Token':token} if token else {})})
        with urlopen(req, timeout=4) as response:
            return json.load(response)

    def test_per_player_skin_visible_to_both_players(self):
        host = self.req('/api/rooms', {'options': {'mode': 'duel'}})
        code, red_token = host['code'], host['token']
        join = self.req(f'/api/rooms/{code}/join', {'name': 'Yellow'})
        yellow_token = join['token']
        change = self.req(f'/api/rooms/{code}/appearance', {'token':red_token,'appearance':'skin:dragons'})
        self.assertEqual(change['room']['appearances']['red'], 'skin:dragons')
        self.req(f'/api/rooms/{code}/appearance', {'token':yellow_token,'appearance':'palette:forest'})
        red = self.req(f'/api/rooms/{code}',token=red_token)
        yellow = self.req(f'/api/rooms/{code}',token=yellow_token)
        self.assertEqual(red['appearances'], yellow['appearances'])
        self.assertEqual(yellow['appearances']['yellow'], 'palette:forest')
        self.assertEqual(yellow['appearances']['red'], 'skin:dragons')
        with self.assertRaises(HTTPError) as ctx:
            self.req(f'/api/rooms/{code}/appearance', {'token':yellow_token,'appearance':'skin:not-real'})
        self.assertEqual(ctx.exception.code, 400)
        after = self.req(f'/api/rooms/{code}')
        self.assertEqual(after['appearances']['yellow'], 'palette:forest')

    def test_all_12_appearances_accepted(self):
        room = self.req('/api/rooms', {'options':{'mode':'four'}})
        for name in server.APPEARANCES:
            response=self.req(f"/api/rooms/{room['code']}/appearance",{'token':room['token'],'appearance':name})
            self.assertEqual(response['room']['appearances']['red'],name)

if __name__=='__main__':
    unittest.main()
