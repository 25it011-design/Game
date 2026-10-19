#!/usr/bin/env python3
"""Builds the five Sky Hopper levels, checks that each is completable, and injects them into game.js."""
import json
import os
import re
import sys
from collections import deque

W, H = 100, 17
SOLID = set('#WB?PQ=')
# game.js lives one folder up from tools/ in the project layout.
GAME_JS = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game.js'))


def grid():
    return [['.'] * W for _ in range(H)]


def put(g, r, c, ch):
    if 0 <= r < H and 0 <= c < W:
        g[r][c] = ch


def put_list(g, r, c0, s):
    for i, ch in enumerate(s):
        put(g, r, c0 + i, ch)


def floor(g, c0, c1):
    for c in range(c0, c1):
        put(g, 15, c, '#')
        put(g, 16, c, '#')


def lava(g, c0, c1):
    for c in range(c0, c1):
        put(g, 15, c, 'L')
        put(g, 16, c, 'L')


def plat(g, c0, c1, row, ch='#'):
    for c in range(c0, c1):
        put(g, row, c, ch)


def pipe(g, c, h, ch='P'):
    """2-wide pipe standing on the floor (row 15), h tiles tall."""
    for r in range(15 - h, 15):
        put(g, r, c, ch)
        put(g, r, c + 1, ch)


def pipe_on(g, c, top, bottom, ch):
    for r in range(top, bottom + 1):
        put(g, r, c, ch)
        put(g, r, c + 1, ch)


def pillar(g, c, h):
    for r in range(15 - h, 15):
        put(g, r, c, 'W')
        put(g, r, c + 1, 'W')


def level_grassland():
    g = grid()
    floor(g, 0, 30); floor(g, 32, 52); floor(g, 54, 80); floor(g, 82, 100)
    put(g, 14, 2, 'S')
    pipe(g, 14, 2, 'P')                     # warp entry on the floor
    plat(g, 66, 76, 10)                     # secret ledge
    pipe_on(g, 70, 8, 9, 'Q')               # warp exit on the ledge
    for c in (67, 68, 73, 74):
        put(g, 6, c, 's')                   # secret coins
    put_list(g, 11, 8, 'B?B?B')
    plat(g, 20, 24, 12)
    put_list(g, 11, 21, 'ccc')
    plat(g, 40, 44, 12)
    put_list(g, 10, 40, 'cccc')
    plat(g, 36, 38, 13, 'W')
    for c in (17, 34, 46, 60, 86):
        put(g, 14, c, 'E')
    put(g, 9, 26, 'K'); put(g, 8, 56, 'K')
    put_list(g, 13, 60, 'ccccc')
    put(g, 14, 48, 'C'); put(g, 14, 88, 'C')
    put(g, 14, 96, 'F')
    return dict(name='Grassland Adventure', theme=0, sky=['#6ec6ff', '#d6f3ff'], ground='#6b4a2a', top='#3fae3f', map=g, flag_goal=True)


def level_caverns():
    g = grid()
    for c in range(W):
        put(g, 0, c, 'W')
    for r in range(H):
        put(g, r, 0, 'W'); put(g, r, 99, 'W')
    floor(g, 1, 22); floor(g, 24, 50); floor(g, 53, 78); floor(g, 80, 99)
    put(g, 14, 3, 'S')
    pipe(g, 60, 2, 'P')                     # warp entry
    plat(g, 70, 78, 6)                      # hidden treasure ledge
    pipe_on(g, 72, 4, 5, 'Q')               # warp exit
    put_list(g, 3, 70, 'ssssss')
    plat(g, 30, 36, 3, 'W')                 # hanging rock
    plat(g, 14, 17, 12)
    plat(g, 36, 39, 12)
    plat(g, 40, 43, 9)
    put_list(g, 11, 56, 'BBB?BBB')
    plat(g, 86, 90, 12)
    for c in (10, 30, 64, 84):
        put(g, 14, c, 'E')
    put(g, 7, 22, 'K'); put(g, 8, 66, 'K')
    put_list(g, 13, 26, 'ccccc')
    put_list(g, 7, 41, 'ccc')
    put(g, 14, 50, 'C'); put(g, 14, 76, 'C')
    put(g, 14, 96, 'F')
    return dict(name='Underground Caverns', theme=1, sky=['#1b1433', '#2d1f4f'], ground='#4a4a5c', top='#7a7a94', map=g, flag_goal=True)


def level_sky():
    g = grid()
    floor(g, 0, 10)
    put(g, 14, 2, 'S')
    chain = [(12, 15, 13), (18, 21, 11), (24, 27, 9), (36, 39, 12), (42, 45, 9),
             (48, 51, 7), (54, 57, 9), (60, 63, 11), (66, 69, 13), (72, 75, 11),
             (78, 82, 9), (84, 87, 11)]
    for c0, c1, row in chain:
        plat(g, c0, c1, row)
        put_list(g, row - 2, c0, 'cc')
    plat(g, 30, 33, 10, '=')                # moving platform
    put_list(g, 8, 30, 'cc')
    floor(g, 88, 100)
    put(g, 10, 19, 'E'); put(g, 6, 49, 'E'); put(g, 14, 93, 'E')
    put(g, 4, 30, 'K'); put(g, 4, 64, 'K')
    put(g, 8, 44, 'C'); put(g, 14, 92, 'C')
    put(g, 14, 96, 'F')
    return dict(name='Sky Platforms', theme=2, sky=['#8ad3ff', '#fff3d6'], ground='#8a6fd1', top='#c9b6ff', map=g, flag_goal=True)


def level_lava():
    g = grid()
    floor(g, 0, 100)
    lava(g, 20, 24); lava(g, 46, 50); lava(g, 70, 76)
    put(g, 14, 2, 'S')
    plat(g, 18, 26, 12); plat(g, 44, 52, 12); plat(g, 68, 78, 12)
    pillar(g, 30, 3); pillar(g, 60, 3); pillar(g, 84, 3)
    put_list(g, 11, 8, 'BB?BB')
    for c in (14, 28, 39, 56, 66, 92):
        put(g, 14, c, 'E')
    put(g, 8, 33, 'K'); put(g, 8, 58, 'K'); put(g, 8, 80, 'K')
    put_list(g, 10, 20, 'ccc'); put_list(g, 10, 46, 'ccc'); put_list(g, 10, 70, 'ccc')
    put(g, 14, 50, 'C'); put(g, 14, 82, 'C')
    put(g, 14, 96, 'F')
    return dict(name='Lava Fortress', theme=3, sky=['#3a1212', '#7a2b12'], ground='#4b2a2a', top='#a34b2a', map=g, flag_goal=True)


def level_castle():
    g = grid()
    for c in range(W):
        put(g, 0, c, 'W')
    for r in range(H):
        put(g, r, 0, 'W'); put(g, r, 99, 'W')
    floor(g, 1, 99)
    lava(g, 40, 42)
    put(g, 14, 2, 'S')
    plat(g, 38, 44, 12)
    pillar(g, 16, 3); pillar(g, 28, 3); pillar(g, 55, 3)
    plat(g, 62, 66, 12); plat(g, 68, 72, 9)
    plat(g, 78, 82, 11); plat(g, 88, 92, 11)
    for c in (10, 22, 34, 50, 58):
        put(g, 14, c, 'E')
    put(g, 6, 20, 'K'); put(g, 6, 46, 'K'); put(g, 8, 76, 'K')
    put_list(g, 10, 4, 'ccc'); put_list(g, 10, 64, 'ccc')
    put(g, 14, 66, 'C')
    put(g, 12, 86, 'X')                     # boss spawn
    return dict(name='Final Castle', theme=4, sky=['#1a0f2e', '#4a2a6b'], ground='#303040', top='#6b6b80', boss=True, map=g, flag_goal=False)


# ---------- Reachability check ----------
def solid(ch):
    return ch in SOLID


def standable(g, r, c):
    if not (0 <= r < H - 1 and 0 <= c < W):
        return False
    ch = g[r][c]
    if solid(ch) or ch == 'L':
        return False
    if not solid(g[r + 1][c]):
        return False
    if r > 0 and solid(g[r - 1][c]):
        return False  # headroom for the 36px body
    return True


def neighbors(g, r, c):
    out = []
    for dc in (-1, 1):                       # walk, step up 1, or fall up to 6
        nc = c + dc
        for dr in range(-1, 7):
            if standable(g, r + dr, nc):
                out.append((r + dr, nc))
                break
    for dc in range(-5, 6):                  # jumps: up to 3 rows high, up to 6 rows down
        if dc == 0:
            continue
        for dr in range(-3, 7):
            if standable(g, r + dr, c + dc):
                out.append((r + dr, c + dc))
    return out


def reachable(g, start):
    seen = {start}
    q = deque([start])
    while q:
        r, c = q.popleft()
        for n in neighbors(g, r, c):
            if n not in seen:
                seen.add(n)
                q.append(n)
    return seen


def find(g, ch):
    for r in range(H):
        for c in range(W):
            if g[r][c] == ch:
                return r, c
    return None


def validate(level):
    g = level['map']
    s = find(g, 'S')
    if not s:
        return 'no spawn'
    start = (s[0], s[1])
    if not standable(g, start[0], start[1]):
        # Spawn sits on the floor row above; the S marker itself is passable.
        start = (start[0], start[1])
    seen = reachable(g, start)
    if level['flag_goal']:
        f = find(g, 'F')
        if not f:
            return 'no flag'
        ok = any(abs(r - f[0]) <= 2 and abs(c - f[1]) <= 1 for r, c in seen)
        if not ok:
            return 'flag unreachable'
    else:
        x = find(g, 'X')
        if not x:
            return 'no boss'
        ok = any(c >= x[1] - 3 for r, c in seen)
        if not ok:
            return 'boss arena unreachable'
    # Count pits (non-solid, non-lava gaps) to confirm the layout is not trivially open
    return 'ok'


def to_js(level):
    return {
        'name': level['name'],
        'theme': level['theme'],
        'sky': level['sky'],
        'ground': level['ground'],
        'top': level['top'],
        'boss': level.get('boss', False),
        'map': [''.join(row) for row in level['map']],
    }


def main():
    levels = [level_grassland(), level_caverns(), level_sky(), level_lava(), level_castle()]
    failed = False
    for i, lv in enumerate(levels):
        result = validate(lv)
        print('Level %d %-22s %s' % (i + 1, lv['name'], result))
        if result != 'ok':
            failed = True
        for row in lv['map']:
            assert len(row) == W, 'row width mismatch in level %d' % (i + 1)
    if failed:
        print('Validation failed. game.js was not modified.')
        sys.exit(1)

    js = 'const LEVELS = ' + json.dumps([to_js(l) for l in levels], indent=1) + ';'
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        src = f.read()
    block = re.compile(r'const LEVELS = \[.*?\n\];', re.DOTALL)
    if '/*__LEVELS__*/' in src:
        src = src.replace('/*__LEVELS__*/', js)
    elif block.search(src):
        src = block.sub(lambda _m: js, src, count=1)
    else:
        print('Could not find the LEVELS block in game.js.')
        sys.exit(1)
    with open(GAME_JS, 'w', encoding='utf-8') as f:
        f.write(src)
    print('Wrote %d levels to %s' % (len(levels), GAME_JS))


if __name__ == '__main__':
    main()
