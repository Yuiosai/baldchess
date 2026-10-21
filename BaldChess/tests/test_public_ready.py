"""Public deployment regressions: auth, host controls, SQLite, and throttling."""
import json
import tempfile
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from unittest.mock import patch

import server


class PublicReadyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.old_data = server.DATA
        server.DATA = Path(self.temp.name) / 'rooms.json'
        server.ROOMS.clear()
        with server.RATE_LOCK:
            server.RATE_LOG.clear()
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
        with server.RATE_LOCK:
            server.RATE_LOG.clear()
        self.temp.cleanup()

    def req(self, path, data=None, token=None):
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['X-BaldChess-Token'] = token
        payload = None if data is None else json.dumps(data).encode('utf8')
        with urlopen(Request(self.base+path, data=payload, headers=headers), timeout=4) as r:
            return json.load(r)

    def test_token_only_in_header(self):
        room = self.req('/api/rooms', {'options': {'mode':'four'}, 'name':'Host'})
        code = room['code']
        secret = room['token']
        self.assertEqual(self.req(f'/api/rooms/{code}',token=secret)['role'], 'red')
        self.assertEqual(self.req(f'/api/rooms/{code}?token={secret}')['role'], 'spectator')
        self.assertNotIn('tokens', self.req(f'/api/rooms/{code}'))

    def test_only_host_changes_rules_but_each_player_changes_skin(self):
        created = self.req('/api/rooms',{'options':{'mode':'four'},'name':'A'})
        code, host = created['code'], created['token']
        other = self.req(f'/api/rooms/{code}/join',{'name':'B'})['token']
        update={'options':{'mode':'four','minutes':15}}
        with self.assertRaises(HTTPError) as err:
            self.req(f'/api/rooms/{code}/settings',update,token=other)
        self.assertEqual(err.exception.code,400)
        self.assertEqual(self.req(f'/api/rooms/{code}/appearance',{'appearance':'skin:dragons'},token=other)['room']['appearances']['blue'],'skin:dragons')
        changed=self.req(f'/api/rooms/{code}/settings',update,token=host)
        self.assertEqual(changed['room']['state']['options']['minutes'],15)
        with self.assertRaises(HTTPError) as err:
            self.req(f'/api/rooms/{code}/settings',{'options':{'mode':'duel'}},token=host)
        self.assertEqual(err.exception.code,400)  # cannot evict already-joined seats
        self.req(f'/api/rooms/{code}/join',{'name':'C'})
        self.req(f'/api/rooms/{code}/join',{'name':'D'})
        restarted = self.req(f'/api/rooms/{code}/settings', update,token=host)
        self.assertEqual(restarted['room']['state']['status'], 'playing')
        self.assertEqual(restarted['room']['state']['move_count'], 0)
        self.assertEqual(restarted['room']['code'], code)
        self.assertEqual(restarted['room']['joined'], 4)

    def test_db_restore_after_restart(self):
        created=self.req('/api/rooms',{'options':{'mode':'duel'},'name':'One'})
        code, token=created['code'],created['token']
        second=self.req(f'/api/rooms/{code}/join',{'name':'Two'})
        self.assertTrue(server.database_path().exists())
        with server.LOCK:
            server.ROOMS.clear()
            server.restore()
        self.assertEqual(self.req(f'/api/rooms/{code}',token=token)['role'],'red')
        self.assertEqual(self.req(f'/api/rooms/{code}',token=second['token'])['role'],'yellow')
        self.assertEqual(self.req(f'/api/rooms/{code}')['state']['status'],'playing')

    def test_migrate_legacy_json_once(self):
        created = self.req('/api/rooms', {'options': {'mode':'duel'}, 'name':'Legacy Host'})
        code, token = created['code'], created['token']
        with server.LOCK:
            server.DATA.write_text(json.dumps(server.ROOMS), encoding='utf-8')
            server.ROOMS.clear()
            server.database_path().unlink()
            server.restore()
        self.assertEqual(self.req(f'/api/rooms/{code}', token=token)['role'], 'red')
        self.assertTrue(server.database_path().is_file())
        # An empty existing database is authoritative and must not import JSON again.
        with server.LOCK:
            server.ROOMS.clear()
            server.persist()
            server.restore()
        self.assertNotIn(code, server.ROOMS)

    def test_rate_limit_create_responds_429(self):
        with patch.dict(server.RATE_LIMITS, {'create':(2, 60)}):
            for _ in range(2):
                self.req('/api/rooms',{'options':{'mode':'duel'}})
            with self.assertRaises(HTTPError) as err:
                self.req('/api/rooms',{'options':{'mode':'duel'}})
            self.assertEqual(err.exception.code,429)

    def test_room_limit_caps_memory(self):
        with patch.object(server, 'MAX_ROOMS', 2):
            for _ in range(2):
                self.req('/api/rooms',{'options':{'mode':'duel'}})
            with self.assertRaises(HTTPError) as err:
                self.req('/api/rooms',{'options':{'mode':'duel'}})
            self.assertEqual(err.exception.code,400)


if __name__ == '__main__':
    unittest.main()
