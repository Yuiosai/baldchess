"""BaldChess 3.0: серверные комнаты и возобновляемые места игроков."""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import argparse
import json
import os
import re
import secrets
import sqlite3
from collections import deque
from contextlib import contextmanager
import threading
import time
import webbrowser
from engine import COLORS, seats, initial_state, public_state, legal_moves, move, resign, validate_options

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'data' / 'rooms.json'
LOCK = threading.RLock()
ROOMS = {}
CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
SKINS = ('classic', 'dragons', 'fortress', 'cosmos', 'mystic', 'pixel')
APPEARANCES = frozenset(('palette:classic','palette:forest','palette:marble','palette:midnight','palette:royal','palette:ice','skin:dragons','skin:fortress','skin:cosmos','skin:mystic','skin:celestial','skin:abyss'))
OFFLINE_SECONDS = 12
DEFAULT_COLORS = {'red':'#f86c86','blue':'#68bfff','yellow':'#ffcf6a','green':'#66e6b6'}
# Per direct client IP. If deployed behind a shared reverse proxy, configure limits at
# the reverse proxy too; do not trust user-supplied X-Forwarded-For blindly.
RATE_LOCK = threading.Lock()
RATE_LOG = {}
RATE_LIMITS = {'create': (10, 60), 'join': (30, 60),
               'write': (120, 60), 'read': (240, 60)}
MAX_ROOMS = 300
ROOM_LIFETIME = {'waiting': 2 * 86400, 'finished': 7 * 86400,
                 'playing': 30 * 86400}


def database_path():
    return Path(os.environ.get('BALDCHESS_DB', str(DATA.with_suffix('.sqlite3'))))


@contextmanager
def storage_connection():
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=10)
    try:
        connection.execute('CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY, payload TEXT NOT NULL)')
        if os.name == 'posix':
            os.chmod(path, 0o600)
        with connection:
            yield connection
    finally:
        connection.close()


def rate_allowed(address, category):
    limit, window = RATE_LIMITS[category]
    now = time.monotonic()
    key = (address, category)
    with RATE_LOCK:
        # Don't retain keys for visitors who stopped sending requests.
        if len(RATE_LOG) > 2000:
            for old_key, hits in list(RATE_LOG.items()):
                if not hits or now - hits[-1] > 120:
                    RATE_LOG.pop(old_key, None)
        hits = RATE_LOG.setdefault(key, deque())
        while hits and now - hits[0] >= window:
            hits.popleft()
        if len(hits) >= limit:
            return False
        hits.append(now)
        return True


def prune_rooms():
    now = time.time()
    for code, room in list(ROOMS.items()):
        state = room.get('state', {})
        age = now - room.get('updated', room.get('created', now))
        if age >= ROOM_LIFETIME.get(state.get('status'), 7 * 86400):
            del ROOMS[code]


def restore():
    """Recover durable rooms from SQLite, migrating older JSON saves once."""
    global ROOMS
    had_database = database_path().exists()
    with storage_connection() as db:
        rows = db.execute('SELECT code, payload FROM rooms').fetchall()
    if rows:
        raw = {}
        for code, payload in rows:
            try:
                raw[code] = json.loads(payload)
            except (ValueError, TypeError):
                continue
    elif not had_database and DATA.exists():
        try:
            raw = json.loads(DATA.read_text(encoding='utf-8'))
        except (ValueError, OSError):
            raw = {}
    else:
        raw = {}
    if not isinstance(raw, dict):
        raw = {}
    for code, room in raw.items():
        if not isinstance(room, dict) or not isinstance(room.get('state'), dict):
            continue
        if room.get('mode') != 'online' or 'options' not in room['state']:
            continue
        room['clock_updated'] = time.time()  # pause clocks during downtime
        room['last_seen'] = {}
        room['host_controls'] = []
        room.setdefault('skins', {c: 'classic' for c in COLORS})
        room.setdefault('colors', DEFAULT_COLORS.copy())
        room.setdefault('appearances', {c: 'palette:classic' for c in COLORS})
        room['appearances'] = {c: (room['appearances'].get(c) if room['appearances'].get(c) in APPEARANCES else 'palette:classic') for c in COLORS}
        room['skins'] = {c: (room['skins'].get(c) if room['skins'].get(c) in SKINS else 'classic') for c in COLORS}
        if room['state']['options'].get('mode') not in ('four','duel'):
            room['state']['options']['mode'] = 'four'
        room.setdefault('updated', room.get('created', int(time.time())))
        ROOMS[code] = room
    prune_rooms()
    persist()  # Also saves one-time legacy JSON migration to SQLite.


def persist():
    """Atomic SQLite transaction for all room state and bearer tokens."""
    with storage_connection() as db:
        db.executemany('INSERT OR REPLACE INTO rooms(code, payload) VALUES (?, ?)',
                       [(code, json.dumps(room, ensure_ascii=False))
                        for code, room in ROOMS.items()])
        stored = [code for (code,) in db.execute('SELECT code FROM rooms')]
        db.executemany('DELETE FROM rooms WHERE code = ?',
                       [(code,) for code in stored if code not in ROOMS])


def create_room(options, name='Создатель'):
    options = validate_options(options)
    prune_rooms()
    if len(ROOMS) >= MAX_ROOMS:
        raise ValueError('Превышен лимит активных комнат. Попробуйте позже')
    code = ''.join(secrets.choice(CODE_ALPHABET) for _ in range(6))
    while code in ROOMS:
        code = ''.join(secrets.choice(CODE_ALPHABET) for _ in range(6))
    state = initial_state(options)
    state['status'] = 'waiting'
    token = secrets.token_urlsafe(24)
    room = {'mode': 'online', 'state': state, 'seats': {c: None for c in COLORS},
            'tokens': {token: 'red'}, 'skins': {c: 'classic' for c in COLORS},
            'colors': DEFAULT_COLORS.copy(), 'appearances': {c: 'palette:classic' for c in COLORS},
            'revision': 1, 'created': int(time.time()), 'updated': time.time(), 'clock_updated': time.time(),
            'last_seen': {'red': time.time()}, 'host_controls': []}
    room['seats']['red'] = clean_name(name)
    ROOMS[code] = room
    persist()
    return code, token


def clean_name(name):
    return str(name or 'Игрок').strip()[:24] or 'Игрок'


def joined(room):
    return sum(room['seats'][c] is not None for c in seats(room['state']['options']))


def refresh_clock(room):
    """Subtract elapsed wall-clock time from the current player's server-authoritative clock."""
    now = time.time()
    last = room.get('clock_updated', now)
    room['clock_updated'] = now
    state = room['state']
    if state['status'] != 'playing' or state.get('clock') is None: return False
    turn = state['turn']
    state['clock'][turn] = max(0.0, state['clock'][turn] - max(0.0, min(now - last, 86400)))
    if state['clock'][turn] <= 0:
        resign(state, turn, 'время вышло')
        room['revision'] += 1
        room['updated'] = now
        persist()
        return True
    return False


def touch(room, color):
    if color is None: return
    room.setdefault('last_seen', {})[color] = time.time()
    if color in room.setdefault('host_controls', []):
        room['host_controls'].remove(color)
        room['revision'] += 1
        persist()


def offline(room, color):
    return room['seats'].get(color) is not None and time.time() - room.get('last_seen', {}).get(color, 0) >= OFFLINE_SECONDS


def describe(code, token=None):
    room = ROOMS[code]
    player = room['tokens'].get(token) if token else None
    return {'code': code, 'mode': 'online', 'state': public_state(room['state']),
            'seats': room['seats'], 'skins': room['skins'], 'colors': room['colors'], 'appearances': room['appearances'], 'joined': joined(room),
            'role': player or 'spectator', 'revision': room['revision'],
            'offline': {c: offline(room, c) for c in seats(room['state']['options'])},
            'host_controls': room.get('host_controls', [])}


class Handler(BaseHTTPRequestHandler):
    server_version = 'BaldChess/5.11'

    def log_message(self, fmt, *args):
        # Do not print player tokens from URL queries.
        if args:
            print(f'[{self.log_date_time_string()}] {str(args[0]).split("?")[0]}')

    def send_bytes(self, content, status=200, kind='application/json; charset=utf-8'):
        self.send_response(status)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Frame-Options', 'DENY')
        self.end_headers()
        self.wfile.write(content)

    def respond(self, data, status=200):
        self.send_bytes(json.dumps(data, ensure_ascii=False).encode('utf-8'), status)

    def fail(self, message, status=400):
        self.respond({'error': str(message)}, status)

    def data(self):
        try: size = int(self.headers.get('Content-Length', '0'))
        except ValueError: raise ValueError('Некорректный размер запроса') from None
        if not 0 < size <= 50000: raise ValueError('Некорректный размер запроса')
        try: result = json.loads(self.rfile.read(size))
        except (UnicodeDecodeError, json.JSONDecodeError): raise ValueError('Некорректные данные JSON') from None
        if not isinstance(result, dict): raise ValueError('Ожидается объект JSON')
        return result

    def serve_file(self, path):
        files = {'/': ('index.html', 'text/html; charset=utf-8'),
                 '/index.html': ('index.html', 'text/html; charset=utf-8'),
                 '/style.css': ('style.css', 'text/css; charset=utf-8'),
                 '/js/board.js': ('js/board.js', 'text/javascript; charset=utf-8'),
                 '/js/game.js': ('js/game.js', 'text/javascript; charset=utf-8'),
                 '/js/app.js': ('js/app.js', 'text/javascript; charset=utf-8'),
                 '/js/pieces.js': ('js/pieces.js', 'text/javascript; charset=utf-8'),
                 '/favicon.svg': ('favicon.svg', 'image/svg+xml'),
                 '/assets/logo.png': ('assets/logo.png', 'image/png'),
                 '/assets/favicon.png': ('assets/favicon.png', 'image/png'),
                 '/js/themes.js': ('js/themes.js', 'text/javascript; charset=utf-8')}
        if path not in files:
            self.fail('Страница не найдена', 404)
            return
        file, mime = files[path]
        try: self.send_bytes((ROOT / file).read_bytes(), kind=mime)
        except OSError: self.fail('Файл не найден', 404)

    def do_GET(self):
        parsed = urlparse(self.path)
        if not parsed.path.startswith('/api/'):
            self.serve_file(parsed.path)
            return
        match = re.fullmatch(r'/api/rooms/([A-Z2-9]{6})', parsed.path)
        if not match:
            self.fail('Неизвестный адрес', 404)
            return
        if not rate_allowed(self.client_address[0], 'read'):
            self.fail('Слишком много запросов. Подождите немного', 429)
            return
        code = match.group(1)
        with LOCK:
            if code not in ROOMS:
                self.fail('Комната не найдена', 404)
                return
            refresh_clock(ROOMS[code])
            token = self.headers.get('X-BaldChess-Token')
            touch(ROOMS[code], ROOMS[code]['tokens'].get(token) if isinstance(token, str) else None)
            self.respond(describe(code, token))

    def do_POST(self):
        path = urlparse(self.path).path
        category = 'create' if path == '/api/rooms' else 'join' if path.endswith('/join') else 'write'
        if not rate_allowed(self.client_address[0], category):
            self.fail('Слишком много запросов. Подождите немного', 429)
            return
        try:
            body = self.data()
            with LOCK: self.handle_post(urlparse(self.path).path, body)
        except ValueError as error: self.fail(error)
        except (BrokenPipeError, ConnectionResetError): pass

    def handle_post(self, path, body):
        if path == '/api/rooms':
            code, token = create_room(body.get('options', {}), body.get('name', 'Создатель'))
            self.respond({'code': code, 'token': token, 'room': describe(code, token)})
            return
        match = re.fullmatch(r'/api/rooms/([A-Z2-9]{6})/(join|legal|move|resign|reset|settings|skin|appearance|takeover)', path)
        if not match:
            self.fail('Неизвестная команда', 404)
            return
        code, action = match.groups()
        if code not in ROOMS:
            self.fail('Комната не найдена', 404)
            return
        room = ROOMS[code]
        token = self.headers.get('X-BaldChess-Token') or body.get('token')  # legacy clients
        color = room['tokens'].get(token) if isinstance(token, str) else None
        refresh_clock(room)
        state = room['state']
        if action == 'join':
            if color is None:
                if state['status'] != 'waiting': raise ValueError('Партия уже началась')
                color = next((c for c in seats(state['options']) if room['seats'][c] is None), None)
                if color is None: raise ValueError('Комната заполнена')
                token = secrets.token_urlsafe(24)
                room['tokens'][token] = color
                room['seats'][color] = clean_name(body.get('name'))
                touch(room, color)
                if joined(room) == len(seats(state['options'])):
                    state['status'] = 'playing'
                    state['history'].append({'kind':'start'})
                    room['clock_updated'] = time.time()
                room['revision'] += 1
                room['updated'] = time.time()
                persist()
            touch(room, color)
            self.respond({'token': token, 'room': describe(code, token)})
            return
        if color is None: raise ValueError('Вы не участвуете в этой партии')
        touch(room, color)
        if action == 'takeover':
            target = body.get('target')
            if color != 'red': raise ValueError('Only the host can control a disconnected player')
            if target not in seats(state['options']) or target == 'red' or not room['seats'].get(target):
                raise ValueError('Invalid player slot')
            if not offline(room, target): raise ValueError('The player is still connected')
            if target in room['host_controls']:
                room['host_controls'].remove(target)
            else:
                room['host_controls'].append(target)
            room['revision'] += 1
            persist()
            self.respond({'room': describe(code, token)})
            return
        controlled = [color]
        if color == 'red':
            controlled += [c for c in room.get('host_controls', []) if offline(room, c)]
        if action == 'legal':
            pos = body.get('from')
            if not isinstance(pos, list) or len(pos) != 2 or any(type(v) is not int for v in pos):
                raise ValueError('Неверные координаты')
            source = state['board'][pos[0]][pos[1]] if 0 <= pos[0] < len(state['board']) and 0 <= pos[1] < len(state['board']) else None
            actor = source['color'] if source else None
            can_queue = state['options']['premoves'] and actor == color
            if state['status'] != 'playing' or actor not in controlled or not state['active'][actor] or (state['turn'] != actor and not can_queue):
                moves = []
            else:
                moves = legal_moves(state, pos[0], pos[1], actor)
            self.respond({'moves': [[r, c] for r, c in moves], 'revision': room['revision']})
            return
        if action == 'move':
            if state['turn'] not in controlled: raise ValueError('It is not your turn')
            start, end = body.get('from'), body.get('to')
            if not isinstance(start, list) or not isinstance(end, list) or len(start) != 2 or len(end) != 2:
                raise ValueError('Invalid coordinates')
            actor = state['turn']
            move(state, start, end, body.get('promotion', 'Q'))
            if state['clock'] is not None:
                state['clock'][actor] += state['options']['increment']
            room['clock_updated'] = time.time()
        elif action == 'resign':
            resign(state, color)
            room['clock_updated'] = time.time()
        elif action == 'reset':
            if color != 'red': raise ValueError('Перезапустить партию может только создатель')
            state = initial_state(state['options'])
            if joined(room) < len(seats(state['options'])): state['status'] = 'waiting'
            room['state'] = state
            room['host_controls'] = []
            room['clock_updated'] = time.time()
        elif action == 'settings':
            if color != 'red' or state['status'] != 'waiting':
                raise ValueError('Настройки меняет создатель до начала партии')
            options = validate_options(body.get('options'))
            if joined(room) > 1 and options['mode'] != state['options']['mode']:
                raise ValueError('Нельзя менять число игроков после подключения участников')
            state = initial_state(options)
            state['status'] = 'waiting'
            room['state'] = state
            room['host_controls'] = []
            room['clock_updated'] = time.time()
        elif action == 'appearance':
            appearance = body.get('appearance')
            if appearance not in APPEARANCES:
                raise ValueError('Unknown board appearance')
            room['appearances'][color] = appearance
        elif action == 'skin':
            skin = body.get('skin')
            if skin not in SKINS: raise ValueError('Неизвестный скин фигур')
            room['skins'][color] = skin
            tint = body.get('color')
            if tint is not None:
                if not isinstance(tint, str) or not re.fullmatch(r'#[0-9a-fA-F]{6}', tint):
                    raise ValueError('Неверный цвет фигур')
                room['colors'][color] = tint.lower()
        room['revision'] += 1
        room['updated'] = time.time()
        persist()
        self.respond({'room': describe(code, token)})


def main():
    parser = argparse.ArgumentParser(description='BaldChess — шахматы на четверых')
    parser.add_argument('--port', type=int, default=int(os.getenv('PORT', '8000')))
    parser.add_argument('--host', default=os.getenv('HOST', '0.0.0.0'))
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    with LOCK: restore()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f'BaldChess запущен: http://localhost:{args.port}')
    if not args.no_browser:
        threading.Timer(0.8, lambda: webbrowser.open(f'http://localhost:{args.port}')).start()
    try: server.serve_forever()
    except KeyboardInterrupt: print('\nСервер остановлен')
    finally: server.server_close()


if __name__ == '__main__': main()
