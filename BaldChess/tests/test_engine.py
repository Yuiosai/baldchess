import unittest
from engine import (initial_state, playable, legal_moves, move, in_check, pseudo_moves,
                    resign, COLORS, any_legal_moves, default_options, fischer_order,
                    home_square, validate_options, promotion_reached)


class ChessTests(unittest.TestCase):
    def setUp(self):
        self.game = initial_state()

    def test_playable_cells(self):
        self.assertEqual(sum(playable(r,c) for r in range(14) for c in range(14)),160)
        self.assertFalse(playable(0,0))
        self.assertTrue(playable(0,3))
        self.assertFalse(playable(14,8))

    def test_initial_pieces(self):
        board=self.game['board']
        for color in COLORS:
            self.assertEqual(sum(p is not None and p['color']==color for row in board for p in row),16)
            self.assertFalse(in_check(board,self.game['active'],color,self.game['options']))
            self.assertTrue(any_legal_moves(self.game,color))
        self.assertEqual(board[13][7]['type'],'K')

    def test_first_turns(self):
        self.assertCountEqual(legal_moves(self.game,12,4),[(11,4),(10,4)])
        move(self.game,(12,4),(10,4))
        self.assertEqual(self.game['turn'],'blue')
        move(self.game,(3,1),(3,3))
        self.assertEqual(self.game['turn'],'yellow')
        move(self.game,(1,5),(3,5))
        move(self.game,(5,12),(5,10))
        self.assertEqual(self.game['turn'],'red')

    def test_wrong_turn(self):
        with self.assertRaisesRegex(ValueError,'другого цвета'):
            move(self.game,(1,5),(3,5))

    def test_promotion_to_any_piece(self):
        for kind in ('Q','R','B','N'):
            state=initial_state()
            state['board'][7][6]={'color':'red','type':'P','moved':True,'promoted':False}
            state['board'][12][6]=None
            move(state,(7,6),(6,6),kind)
            self.assertEqual(state['board'][6][6]['type'],kind)
            self.assertEqual(state['history'][-1]['promotion'],kind)
        with self.assertRaises(ValueError):
            state=initial_state()
            move(state,(12,4),(11,4),'K')

    def test_four_directions(self):
        state=self.game
        self.assertIn((11,4),pseudo_moves(state,12,4))
        self.assertIn((4,2),pseudo_moves(state,4,1))
        self.assertIn((2,5),pseudo_moves(state,1,5))
        self.assertIn((5,11),pseudo_moves(state,5,12))
        self.assertTrue(promotion_reached('red',6,4))
        self.assertFalse(promotion_reached('red',7,4))
        self.assertFalse('directions' in state['options'])

    def test_resign(self):
        for color in ('blue','yellow','green'):resign(self.game,color)
        self.assertEqual(self.game['winner'],'red')
        self.assertEqual(self.game['status'],'finished')

    def test_king_safety(self):
        b=self.game['board']
        for r in range(14):
            for c in range(14):b[r][c]=None
        b[10][7]={'color':'red','type':'K','moved':False,'promoted':False}
        b[0][7]={'color':'yellow','type':'R','moved':False,'promoted':False}
        b[0][6]={'color':'yellow','type':'K','moved':False,'promoted':False}
        self.assertNotIn((9,7),legal_moves(self.game,10,7))

    def test_castle_click_rook(self):
        b=self.game['board']
        b[13][8]=None
        b[13][9]=None
        self.assertIn((13,10),legal_moves(self.game,13,7))
        move(self.game,(13,7),(13,10))
        self.assertEqual(b[13][9]['type'],'K')
        self.assertEqual(b[13][8]['type'],'R')
        self.assertIsNone(b[13][10])

    def test_fischer_orders(self):
        for _ in range(30):
            order=fischer_order()
            self.assertEqual(sorted(order),sorted('RNBQKBNR'))
            bishops=[i for i,x in enumerate(order) if x=='B']
            self.assertNotEqual(bishops[0]%2,bishops[1]%2)
            king=order.index('K')
            rooks=[i for i,x in enumerate(order) if x=='R']
            self.assertTrue(rooks[0]<king<rooks[1])
        opts=default_options();opts['variant']='fischer'
        state=initial_state(opts)
        for color in COLORS:
            pieces=[state['board'][home_square(color,i)[0]][home_square(color,i)[1]]['type'] for i in range(8)]
            self.assertTrue(pieces.index('R')<pieces.index('K')<7)
            self.assertEqual(pieces, [state['board'][home_square('red',i)[0]][home_square('red',i)[1]]['type'] for i in range(8)])

    def test_duel_initial_state(self):
        opts=default_options();opts['mode']='duel'
        state=initial_state(opts)
        self.assertEqual(len(state['board']),8)
        self.assertEqual(state['board'][7][4]['type'],'K')
        self.assertEqual(state['board'][0][4]['color'],'yellow')
        self.assertEqual(sum(bool(p) for row in state['board'] for p in row),32)
        self.assertEqual(legal_moves(state,6,4),[(5,4),(4,4)])
        move(state,(6,4),(4,4))
        self.assertEqual(state['turn'],'yellow')
        move(state,(1,4),(3,4))
        self.assertEqual(state['turn'],'red')

    def test_duel_fischer_consistency(self):
        opts=default_options();opts['mode']='duel';opts['variant']='fischer'
        for _ in range(20):
            state=initial_state(opts)
            self.assertEqual([p['type'] for p in state['board'][0]], [p['type'] for p in state['board'][7]])

    def test_duel_custom_validation(self):
        opts=default_options();opts['mode']='duel';opts['variant']='custom'
        opts['custom_board']=[[None]*8 for _ in range(8)]
        opts['custom_board'][7][4]={'type':'K','color':'red'}
        opts['custom_board'][0][4]={'type':'K','color':'yellow'}
        self.assertEqual(len(initial_state(opts)['board']),8)

    def test_custom_setup(self):
        opts=default_options();opts['variant']='custom'
        board=[[None]*14 for _ in range(14)]
        for color in COLORS:
            r,c=home_square(color,4)
            board[r][c]={'type':'K','color':color}
        board[10][7]={'type':'N','color':'red'}
        opts['custom_board']=board
        state=initial_state(opts)
        self.assertEqual(state['board'][10][7]['type'],'N')
        self.assertEqual(state['board'][10][7]['color'],'red')
        board[10][7]={'type':'K','color':'red'}
        with self.assertRaisesRegex(ValueError,'ровно один король'):
            validate_options(opts)

    def test_individual_timers(self):
        options=default_options()
        options['seat_minutes']={'red':1,'blue':3,'yellow':5,'green':10}
        state=initial_state(options)
        self.assertEqual(state['clock'],{'red':60.0,'blue':180.0,'yellow':300.0,'green':600.0})
        options['seat_minutes']['red']=0
        with self.assertRaisesRegex(ValueError,'таймеры'):
            validate_options(options)

    def test_teams_three_against_one(self):
        opts=default_options();opts['format']='teams';opts['teams']={'red':0,'blue':0,'yellow':0,'green':1}
        state=initial_state(opts)
        self.assertNotEqual(state['options']['teams']['red'],state['options']['teams']['green'])
        resign(state,'green')
        self.assertEqual(state['status'],'finished')
        self.assertCountEqual(state['winners'],['red','blue','yellow'])

    def test_teams_cannot_capture_or_attack_each_other(self):
        opts=default_options();opts['format']='teams';opts['teams']={'red':0,'blue':0,'yellow':1,'green':1}
        state=initial_state(opts)
        board=state['board']
        for r in range(14):
            for c in range(14):board[r][c]=None
        for color in COLORS:
            r,c=home_square(color,4)
            board[r][c]={'type':'K','color':color,'moved':False,'promoted':False}
        board[10][7]={'type':'R','color':'red','moved':True,'promoted':False}
        board[8][7]={'type':'R','color':'blue','moved':True,'promoted':False}
        self.assertNotIn((8,7),legal_moves(state,10,7))
        self.assertFalse(in_check(board,state['active'],'blue',state['options']))

if __name__=='__main__':unittest.main()
