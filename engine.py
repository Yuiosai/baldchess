"""BaldChess: правила на сервере. Без внешних зависимостей."""
import secrets

SIZE = 14
COLORS = ("red", "blue", "yellow", "green")
PIECES = ("R", "N", "B", "Q", "K", "B", "N", "R")
KINDS = "PNBRQK"
DEFAULT_DIRECTIONS = {"red": "up", "blue": "right", "yellow": "down", "green": "left"}
VECTORS = {"up": (-1, 0), "down": (1, 0), "left": (0, -1), "right": (0, 1)}
STRAIGHT = ((1, 0), (-1, 0), (0, 1), (0, -1))
DIAGONAL = ((1, 1), (1, -1), (-1, 1), (-1, -1))
KNIGHTS = ((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1))
NAMES = {"red": "Красные", "blue": "Синие", "yellow": "Жёлтые", "green": "Зелёные"}
PROMOTIONS = ("Q", "R", "B", "N")


def playable(r, c, size=SIZE):
    return 0 <= r < size and 0 <= c < size and (size == 8 or not ((r < 3 or r > 10) and (c < 3 or c > 10)))


def seats(options):
    return ("red", "yellow") if options["mode"] == "duel" else COLORS


def default_options():
    return {"mode": "four", "variant": "classic", "format": "ffa", "teams": dict(zip(COLORS, range(4))),
            "minutes": 10, "increment": 0, "seat_minutes": None, "premoves": True, "custom_board": None}


def validate_options(value):
    if not isinstance(value, dict):
        raise ValueError("Настройки должны быть объектом")
    result = default_options()
    result.update({key: value[key] for key in result if key in value})
    if result["mode"] not in ("four", "duel"):
        raise ValueError("Неверное число игроков")
    if result["variant"] not in ("classic", "fischer", "custom"):
        raise ValueError("Неизвестный вариант расстановки")
    if result["format"] not in ("ffa", "teams"):
        raise ValueError("Неверный режим команд")
    teams = result["teams"]
    if not isinstance(teams, dict) or set(teams) != set(COLORS) or any(type(teams[c]) is not int or teams[c] not in range(4) for c in COLORS):
        raise ValueError("Неверная схема команд")
    if result["mode"] == "duel":
        result["format"] = "ffa"
    if result["format"] == "ffa":
        result["teams"] = dict(zip(COLORS, range(4)))
    elif len(set(teams.values())) < 2:
        raise ValueError("Нужно хотя бы две разные команды")
    if type(result["minutes"]) is not int or result["minutes"] not in (0, 1, 3, 5, 10, 15, 30, 60):
        raise ValueError("Недопустимое время на игрока")
    if type(result["increment"]) is not int or result["increment"] not in (0, 1, 2, 3, 5, 10, 15, 30):
        raise ValueError("Недопустимая прибавка времени")
    times = result["seat_minutes"]
    if times is not None:
        if not isinstance(times, dict) or set(times) != set(seats(result)) or any(type(times[c]) is not int or times[c] not in (1, 3, 5, 10, 15, 30, 60) for c in seats(result)):
            raise ValueError("Недопустимые индивидуальные таймеры")
    if type(result["premoves"]) is not bool:
        raise ValueError("Неверная настройка премувов")
    if result["variant"] == "custom":
        validate_custom_board(result["custom_board"], result["mode"])
    else:
        result["custom_board"] = None
    return result


def validate_custom_board(board, mode="four"):
    size = 8 if mode == "duel" else 14
    allowed = ("red", "yellow") if mode == "duel" else COLORS
    if not isinstance(board, list) or len(board) != size or any(not isinstance(row, list) or len(row) != size for row in board):
        raise ValueError(f"Поле редактора должно быть {size}×{size}")
    kings = {c: 0 for c in allowed}
    for r in range(size):
        for c in range(size):
            p = board[r][c]
            if not playable(r, c, size):
                if p is not None:
                    raise ValueError("Фигуры не могут стоять за пределами поля")
                continue
            if p is None:
                continue
            if not isinstance(p, dict) or p.get("color") not in allowed or not isinstance(p.get("type"), str) or p["type"] not in KINDS:
                raise ValueError("Неизвестная фигура в редакторе")
            if p["type"] == "K":
                kings[p["color"]] += 1
    if any(kings[c] != 1 for c in allowed):
        raise ValueError("Для каждого цвета нужен ровно один король")


def home_square(color, index, pawn=False, size=SIZE):
    if size == 8:
        return ((6 if pawn else 7), index) if color == "red" else ((1 if pawn else 0), index)
    if color == "red": return (12 if pawn else 13, 3 + index)
    if color == "blue": return (3 + index, 1 if pawn else 0)
    if color == "yellow": return (1 if pawn else 0, 10 - index)
    return (10 - index, 12 if pawn else 13)


def home_index(color, r, c, size=SIZE):
    if size == 8:
        if color == "red" and r == 7: return c
        if color == "yellow" and r == 0: return c
        return None
    if color == "red" and r == 13: return c - 3
    if color == "blue" and c == 0: return r - 3
    if color == "yellow" and r == 0: return 10 - c
    if color == "green" and c == 13: return 10 - r
    return None


def fischer_order():
    """Одна из 960 корректных расстановок: слоны на разных цветах, K между R."""
    rng = secrets.SystemRandom()
    result = [None] * 8
    result[rng.choice([0, 2, 4, 6])] = "B"
    result[rng.choice([1, 3, 5, 7])] = "B"
    choices = [i for i in range(8) if result[i] is None]
    result[rng.choice(choices)] = "Q"
    choices = [i for i in range(8) if result[i] is None]
    for i in rng.sample(choices, 2): result[i] = "N"
    rest = [i for i in range(8) if result[i] is None]
    for i, k in zip(rest, ("R", "K", "R")): result[i] = k
    return result


def initial_state(options=None):
    options = validate_options(options or {})
    size = 8 if options["mode"] == "duel" else SIZE
    players = seats(options)
    board = [[None for _ in range(size)] for _ in range(size)]
    if options["variant"] == "custom":
        for r in range(size):
            for c in range(size):
                item = options["custom_board"][r][c]
                if item:
                    board[r][c] = {"type": item["type"], "color": item["color"], "moved": False, "promoted": False}
    else:
        # Each player uses one and the same Fischer order, seen from their own home edge.
        order = fischer_order() if options["variant"] == "fischer" else PIECES
        for color in players:
            for i, kind in enumerate(order):
                for pawn, k in ((False, kind), (True, "P")):
                    r, c = home_square(color, i, pawn, size)
                    board[r][c] = {"type": k, "color": color, "moved": False, "promoted": False}
    return {"board": board, "active": {c: c in players for c in COLORS}, "turn": "red",
            "status": "playing", "winner": None, "winners": [], "history": [],
            "last_move": None, "move_count": 0, "en_passant": None, "options": options,
            "clock": ({c: float(options["seat_minutes"][c] * 60) for c in players} if options["seat_minutes"] else
                      {c: float(options["minutes"] * 60) for c in players} if options["minutes"] else None)}


def allies(state, a, b):
    return state["options"]["teams"][a] == state["options"]["teams"][b]


def attacks_square(board, active, from_r, from_c, to_r, to_c, directions=None):
    piece = board[from_r][from_c]
    if not piece or not active[piece["color"]] or (from_r, from_c) == (to_r, to_c):
        return False
    dr, dc = to_r - from_r, to_c - from_c
    kind = piece["type"]
    if kind == "N": return (abs(dr), abs(dc)) in ((1, 2), (2, 1))
    if kind == "K": return max(abs(dr), abs(dc)) == 1
    if kind == "P":
        direct = (directions or DEFAULT_DIRECTIONS)[piece["color"]]
        fr, fc = VECTORS[direct]
        return (dr == fr and abs(dc) == 1) if fr else (dc == fc and abs(dr) == 1)
    rook_shape = (dr == 0) != (dc == 0)
    bishop_shape = abs(dr) == abs(dc) and dr != 0
    if kind == "R" and not rook_shape: return False
    if kind == "B" and not bishop_shape: return False
    if kind == "Q" and not (rook_shape or bishop_shape): return False
    sr, sc = (dr > 0) - (dr < 0), (dc > 0) - (dc < 0)
    r, c = from_r + sr, from_c + sc
    while (r, c) != (to_r, to_c):
        if not playable(r, c, len(board)) or board[r][c] is not None: return False
        r, c = r + sr, c + sc
    return True


def attacked(board, active, r, c, defended_color, options=None):
    options = options or default_options()
    for rr in range(len(board)):
        for cc in range(len(board)):
            p = board[rr][cc]
            if p and active[p["color"]] and options["teams"][p["color"]] != options["teams"][defended_color]:
                if attacks_square(board, active, rr, cc, r, c, DEFAULT_DIRECTIONS):
                    return True
    return False


def king_position(board, color):
    for r in range(len(board)):
        for c in range(len(board)):
            p = board[r][c]
            if p and p["type"] == "K" and p["color"] == color: return r, c
    return None


def in_check(board, active, color, options=None):
    pos = king_position(board, color)
    return bool(pos and attacked(board, active, *pos, color, options))


def available_target(state, color, r, c):
    if not playable(r, c, len(state["board"])): return False
    target = state["board"][r][c]
    return target is None or (not allies(state, target["color"], color) and target["type"] != "K")


def between_indices(a, b):
    step = 1 if b > a else -1
    return range(a + step, b + step, step) if b != a else ()


def castle_moves(state, r, c, color):
    """Legal castling rook squares (internal compatibility for Chess960)."""
    if state["options"]["variant"] == "custom": return []
    board, active, options = state["board"], state["active"], state["options"]
    king = board[r][c]
    kidx = home_index(color, r, c, len(board))
    if kidx is None or not 0 <= kidx <= 7 or king["moved"] or in_check(board, active, color, options): return []
    found = []
    for side in (-1, 1):
        rook_indexes = range(kidx - 1, -1, -1) if side < 0 else range(kidx + 1, 8)
        ridx = None
        for i in rook_indexes:
            rr, cc = home_square(color, i, size=len(board))
            p = board[rr][cc]
            if p is not None:
                if p["type"] == "R" and p["color"] == color and not p["moved"]:
                    ridx = i
                break
        if ridx is None: continue
        kdest, rdest = ((2, 3) if side < 0 else (6, 5))
        kr, kc = home_square(color, kidx, size=len(board))
        rr, rc = home_square(color, ridx, size=len(board))
        # Every destination/through-square must be clear, except king/rook origins.
        traversed = set(between_indices(kidx, kdest)) | set(between_indices(ridx, rdest)) | {kdest, rdest}
        if any(board[home_square(color, i, size=len(board))[0]][home_square(color, i, size=len(board))[1]] is not None
               for i in traversed if i not in (kidx, ridx)):
            continue
        cleared = [row[:] for row in board]
        cleared[kr][kc] = None
        cleared[rr][rc] = None
        safe = True
        for i in between_indices(kidx, kdest):
            tr, tc = home_square(color, i, size=len(board))
            probe = [row[:] for row in cleared]
            probe[tr][tc] = king
            if attacked(probe, active, tr, tc, color, options):
                safe = False
                break
        if safe: found.append((rr, rc))
    return found


def castling_target(state, r, c, rr, cc):
    """Return the rook's square when destination means castling.

    Prefer a legal king landing square, but support a rook click if the king
    starts on its final square (Chess960), and for older clients.
    """
    board = state['board']
    king = board[r][c]
    if not king or king['type'] != 'K':
        return None
    color = king['color']
    kidx = home_index(color, r, c, len(board))
    if kidx is None:
        return None
    for rook_pos in castle_moves(state, r, c, color):
        ridx = home_index(color, *rook_pos, len(board))
        dest = home_square(color, 2 if ridx < kidx else 6, size=len(board))
        if (rr, cc) == dest and dest != (r, c) or (rr, cc) == rook_pos:
            return rook_pos
    return None


def pseudo_moves(state, r, c):
    if not playable(r, c, len(state["board"])): return []
    board = state["board"]
    piece = board[r][c]
    if not piece or not state["active"][piece["color"]]: return []
    color, kind = piece["color"], piece["type"]
    result = []
    if kind == "P":
        fr, fc = VECTORS[DEFAULT_DIRECTIONS[color]]
        rr, cc = r + fr, c + fc
        if playable(rr, cc, len(board)) and board[rr][cc] is None:
            result.append((rr, cc))
            rr2, cc2 = rr + fr, cc + fc
            if not piece["moved"] and playable(rr2, cc2, len(board)) and board[rr2][cc2] is None: result.append((rr2, cc2))
        for side in (-1, 1):
            rr, cc = ((r + fr, c + side) if fr else (r + side, c + fc))
            if playable(rr, cc, len(board)):
                target = board[rr][cc]
                if target and not allies(state, color, target["color"]) and target["type"] != "K": result.append((rr, cc))
                elif not target and state.get("en_passant") and state["en_passant"]["target"] == [rr, cc] and state["en_passant"]["color"] != color:
                    result.append((rr, cc))
    elif kind == "N":
        for dr, dc in KNIGHTS:
            if available_target(state, color, r + dr, c + dc): result.append((r + dr, c + dc))
    elif kind == "K":
        for dr, dc in STRAIGHT + DIAGONAL:
            if available_target(state, color, r + dr, c + dc): result.append((r + dr, c + dc))
        for rook_pos in castle_moves(state, r, c, color):
            # Chess.com-style click or drag king onto c/g, not onto the rook.
            # Chess960 still supports rook-click if the king is already on c/g.
            kidx = home_index(color, r, c, len(board))
            ridx = home_index(color, *rook_pos, len(board))
            end = home_square(color, 2 if ridx < kidx else 6, size=len(board))
            if end != (r, c) and end not in result:
                result.append(end)
            # Preserve rook-square castling for old clients and Chess960.
            if rook_pos not in result:
                result.append(rook_pos)
    else:
        directions = (STRAIGHT if kind == "R" else DIAGONAL if kind == "B" else STRAIGHT + DIAGONAL)
        for dr, dc in directions:
            rr, cc = r + dr, c + dc
            while playable(rr, cc, len(board)):
                other = board[rr][cc]
                if other:
                    if not allies(state, color, other["color"]) and other["type"] != "K": result.append((rr, cc))
                    break
                result.append((rr, cc))
                rr, cc = rr + dr, cc + dc
    return result


def promotion_reached(color, r, c, directions=None, size=SIZE):
    if size == 8: return r == (0 if color == "red" else 7)
    direction = (directions or DEFAULT_DIRECTIONS)[color]
    return {"up": r <= 6, "down": r >= 7, "right": c >= 7, "left": c <= 6}[direction]


def perform_on_board(board, start, end, directions=None, promotion="Q", en_passant=None, castle_rook=None):
    r, c = start
    rr, cc = end
    piece = dict(board[r][c])
    target = board[rr][cc]
    board[r][c] = None
    castled = False
    promoted = False
    if castle_rook is not None:
        color = piece["color"]
        kidx = home_index(color, r, c, len(board))
        ridx = home_index(color, *castle_rook, len(board))
        kd, rd = ((2, 3) if ridx < kidx else (6, 5))
        kr, kc = home_square(color, kd, size=len(board))
        tr, tc = home_square(color, rd, size=len(board))
        rook = dict(board[castle_rook[0]][castle_rook[1]])
        board[castle_rook[0]][castle_rook[1]] = None
        rook["moved"] = True
        board[tr][tc] = rook
        piece["moved"] = True
        board[kr][kc] = piece
        castled = True
    else:
        piece["moved"] = True
        if (piece["type"] == "P" and target is None and c != cc and en_passant
                and en_passant["target"] == [rr, cc] and en_passant["color"] != piece["color"]):
            er, ec = en_passant["pawn"]
            board[er][ec] = None
        promoted = piece["type"] == "P" and promotion_reached(piece["color"], rr, cc, directions, len(board))
        if promoted:
            piece["type"] = promotion
            piece["promoted"] = True
        board[rr][cc] = piece
    return {"promoted": promoted, "castled": castled}


def legal_moves(state, r, c, color=None):
    board = state["board"]
    if not playable(r, c, len(state["board"])): return []
    piece = board[r][c]
    if not piece or (color and piece["color"] != color) or not state["active"][piece["color"]]: return []
    result = []
    for dst in pseudo_moves(state, r, c):
        attempt = [line[:] for line in board]
        perform_on_board(attempt, (r, c), dst, DEFAULT_DIRECTIONS,
                         en_passant=state.get("en_passant"),
                         castle_rook=castling_target(state, r, c, *dst))
        if not in_check(attempt, state["active"], piece["color"], state["options"]): result.append(dst)
    return result


def any_legal_moves(state, color):
    if not state["active"][color]: return False
    for r in range(len(state["board"])):
        for c in range(len(state["board"])):
            p = state["board"][r][c]
            if p and p["color"] == color and legal_moves(state, r, c, color): return True
    return False


def square_name(r, c, size=SIZE):
    return f"{'abcdefghijklmn'[c]}{size-r}"


def finish_if_needed(state):
    alive = [c for c in seats(state["options"]) if state["active"][c]]
    remaining_teams = set(state["options"]["teams"][c] for c in alive)
    if len(remaining_teams) <= 1:
        state["status"] = "finished"
        state["winners"] = alive
        state["winner"] = alive[0] if len(alive) == 1 else None
        state["turn"] = None
        text = ", ".join(NAMES[c] for c in alive) if alive else "Ничья"
        state["history"].append({'kind':'win','players':alive})
        return True
    return False


def advance_turn(state, acting_color):
    if finish_if_needed(state): return
    participants = seats(state["options"])
    start = (participants.index(acting_color) + 1) % len(participants)
    for i in range(len(participants)):
        color = participants[(start + i) % len(participants)]
        if not state["active"][color]: continue
        if any_legal_moves(state, color):
            state["turn"] = color
            return
        mate = in_check(state["board"], state["active"], color, state["options"])
        if not mate and state["options"]["mode"] == "duel":
            state["status"] = "finished"
            state["turn"] = None
            state["winners"] = []
            state["winner"] = None
            state["history"].append({'kind':'draw'})
            return
        state["active"][color] = False
        state['history'].append({'kind':'out','color':color,'reason':'checkmate' if mate else 'stalemate'})
        if finish_if_needed(state): return
    finish_if_needed(state)


def move(state, start, end, promotion="Q"):
    if state["status"] != "playing": raise ValueError("Партия ещё не началась или уже окончена")
    if not all(type(x) is int for x in (*start, *end)): raise ValueError("Неверные координаты")
    r, c = start
    rr, cc = end
    if not playable(r, c, len(state["board"])) or not playable(rr, cc, len(state["board"])): raise ValueError("Клетка за пределами доски")
    piece = state["board"][r][c]
    if not piece or piece["color"] != state["turn"]: raise ValueError("Сейчас ходят фигуры другого цвета")
    if (rr, cc) not in legal_moves(state, r, c, state["turn"]): raise ValueError("Недопустимый ход или король под шахом")
    if promotion not in PROMOTIONS: raise ValueError("Допустимы только ферзь, ладья, слон и конь")
    actor = state["turn"]
    castling_rook = castling_target(state, r, c, rr, cc)
    captured = state["board"][rr][cc] if castling_rook is None else None
    en_passant = state.get("en_passant")
    ep_capture = (piece["type"] == "P" and en_passant and en_passant["target"] == [rr, cc]
                  and c != cc and captured is None)
    result = perform_on_board(state["board"], start, end, DEFAULT_DIRECTIONS,
                              promotion, en_passant, castle_rook=castling_rook)
    state["en_passant"] = None
    if piece["type"] == "P" and abs(rr - r) + abs(cc - c) == 2 and (r == rr or c == cc):
        state["en_passant"] = {"target": [(r + rr) // 2, (c + cc) // 2], "pawn": [rr, cc], "color": actor}
    state["history"].append({'kind':'move','color':actor,'from':square_name(r,c,len(state['board'])),
                             'to':square_name(rr,cc,len(state['board'])), 'castle':result['castled'],
                             'capture':bool(captured or ep_capture),
                             'promotion':promotion if result['promoted'] else None})
    state["history"] = state["history"][-250:]
    last_end = (home_square(actor, 2 if home_index(actor, *castling_rook, len(state['board'])) <
                             home_index(actor, r, c, len(state['board'])) else 6,
                             size=len(state['board'])) if castling_rook is not None else (rr, cc))
    state["last_move"] = {"from": [r, c], "to": list(last_end)}
    state["move_count"] += 1
    advance_turn(state, actor)
    return state


def resign(state, color, reason="сдались"):
    if state["status"] != "playing" or not state["active"].get(color):
        raise ValueError("Этот игрок уже выбыл или партия закончилась")
    state["active"][color] = False
    state['history'].append({'kind':'out','color':color,'reason':'timeout' if 'время' in reason else 'resigned'})
    if not finish_if_needed(state) and state["turn"] == color: advance_turn(state, color)
    return state


def public_state(state):
    options = state.get("options") or default_options()
    checks = {c: (in_check(state["board"], state["active"], c, options) if state["active"][c] else False) for c in COLORS}
    return {**state, "checks": checks}
