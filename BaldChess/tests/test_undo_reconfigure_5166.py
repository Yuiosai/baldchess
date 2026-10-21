"""Regression: multi-client last-move undo and a new game without losing seats."""
import json
import tempfile
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class SynchronizedRematchTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.old_data = server.DATA
        server.DATA = Path(self.tmp.name) / 'rooms.json'
        server.ROOMS.clear()
        with server.RATE_LOCK: server.RATE_LOG.clear()
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.base = f'http://127.0.0.1:{self.http.server_port}'

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join(timeout=3)
        server.ROOMS.clear()
        server.DATA = self.old_data
        self.tmp.cleanup()

    def req(self, path, data=None, token=None):
        headers = {'Content-Type': 'application/json'}
        if token: headers['X-BaldChess-Token'] = token
        req = Request(self.base + path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
        with urlopen(req, timeout=4) as res:
            return json.load(res)

    def duo(self):
        made = self.req('/api/rooms', {'name':'Alice','options':{'mode':'duel','minutes':10}})
        code,host = made['code'],made['token']
        guest = self.req(f'/api/rooms/{code}/join',{'name':'Bob'})['token']
        return code,host,guest

    def test_last_mover_or_host_undo_and_replay(self):
        code,host,guest = self.duo()
        start = self.req(f'/api/rooms/{code}',token=host)['state']['board']
        self.assertFalse(self.req(f'/api/rooms/{code}', token=host)['can_undo'])
        self.req(f'/api/rooms/{code}/move', {'from':[6,4],'to':[4,4]}, host)
        self.assertTrue(self.req(f'/api/rooms/{code}', token=host)['can_undo'])
        self.assertFalse(self.req(f'/api/rooms/{code}', token=guest)['can_undo'])
        with self.assertRaises(HTTPError) as denied:
            self.req(f'/api/rooms/{code}/undo',{}, guest)
        self.assertEqual(denied.exception.code, 400)
        undone = self.req(f'/api/rooms/{code}/undo',{}, host)['room']
        self.assertEqual(undone['state']['board'],start)
        self.assertEqual(undone['state']['turn'],'red')
        self.assertEqual(undone['state']['move_count'],0)
        self.assertFalse(undone['can_undo'])
        self.req(f'/api/rooms/{code}/move',{'from':[6,4],'to':[4,4]},host)
        self.req(f'/api/rooms/{code}/move',{'from':[1,4],'to':[3,4]},guest)
        self.assertTrue(self.req(f'/api/rooms/{code}',token=guest)['can_undo'])
        back = self.req(f'/api/rooms/{code}/undo',{},guest)['room']
        self.assertEqual(back['state']['turn'],'yellow')
        self.assertEqual(back['state']['move_count'],1)
        self.assertEqual(back['state']['board'][3][4],None)

    def test_reconfigure_started_room_preserves_tokens_and_seats(self):
        code,host,guest = self.duo()
        self.req(f'/api/rooms/{code}/move',{'from':[6,4],'to':[4,4]},host)
        changed=self.req(f'/api/rooms/{code}/settings',{'options':{'mode':'duel','minutes':3,'increment':2}},host)['room']
        self.assertEqual(changed['code'],code)
        self.assertEqual(changed['state']['status'],'playing')
        self.assertEqual(changed['state']['move_count'],0)
        self.assertEqual(changed['state']['clock']['red'],180)
        self.assertEqual(changed['state']['options']['increment'],2)
        self.assertEqual(changed['seats']['red'],'Alice')
        self.assertEqual(changed['seats']['yellow'],'Bob')
        self.assertEqual(self.req(f'/api/rooms/{code}',token=guest)['role'],'yellow')
        self.assertFalse(changed['can_undo'])
        wider=self.req(f'/api/rooms/{code}/settings',{'options':{'mode':'four','minutes':5}},host)['room']
        self.assertEqual(wider['state']['status'],'waiting')
        self.assertEqual(len(wider['state']['board']),14)
        self.assertEqual(wider['joined'],2)
        self.assertEqual(self.req(f'/api/rooms/{code}/join',{'name':'Carol'})['room']['role'],'blue')
        self.assertEqual(self.req(f'/api/rooms/{code}/join',{'name':'Dave'})['room']['role'],'green')
        started=self.req(f'/api/rooms/{code}',token=guest)
        self.assertEqual(started['state']['status'],'playing')
        with self.assertRaises(HTTPError):
            self.req(f'/api/rooms/{code}/settings',{'options':{'mode':'duel'}},host)


if __name__ == '__main__':
    unittest.main()
