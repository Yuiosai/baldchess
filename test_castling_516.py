"""Castling landing-square behavior for two- and four-player boards."""
import unittest
from engine import initial_state, legal_moves, move, home_square, default_options


class LandingSquareCastlingTests(unittest.TestCase):
    def test_all_four_seats_short_and_long_castling_by_king_destination(self):
        for color in ('red','blue','yellow','green'):
            for dest_idx, rook_idx, rook_end_idx in ((6,7,5),(2,0,3)):
                with self.subTest(color=color, dest_idx=dest_idx):
                    state=initial_state()
                    board=state['board']
                    state['turn']=color
                    # Remove all pieces except the four kings and the active castle rook;
                    # avoids unintentional enemy attacks and isolates castling.
                    for r,row in enumerate(board):
                        for c in range(len(row)):
                            if board[r][c] is not None:
                                board[r][c]=None
                    king_pos=home_square(color,4)
                    rook_pos=home_square(color,rook_idx)
                    board[king_pos[0]][king_pos[1]]={'type':'K','color':color,'moved':False,'promoted':False}
                    board[rook_pos[0]][rook_pos[1]]={'type':'R','color':color,'moved':False,'promoted':False}
                    target=home_square(color,dest_idx)
                    self.assertIn(target,legal_moves(state,*king_pos,color))
                    move(state,king_pos,target)
                    self.assertEqual(board[target[0]][target[1]]['type'],'K')
                    self.assertEqual(board[home_square(color,rook_end_idx)[0]][home_square(color,rook_end_idx)[1]]['type'],'R')
                    self.assertTrue(next(h['castle'] for h in state['history'] if h['kind']=='move'))
                    self.assertEqual(state['last_move']['to'],list(target))

    def test_classical_duel_landing_square(self):
        opts=default_options();opts['mode']='duel'
        state=initial_state(opts)
        board=state['board']
        board[7][5]=None;board[7][6]=None
        self.assertIn((7,6),legal_moves(state,7,4,'red'))
        move(state,(7,4),(7,6))
        self.assertEqual(board[7][6]['type'],'K')
        self.assertEqual(board[7][5]['type'],'R')
        self.assertEqual(state['history'][-1]['capture'],False)
        self.assertTrue(state['history'][-1]['castle'])

    def test_fischer_king_already_on_landing_square(self):
        opts=default_options();opts['mode']='duel';opts['variant']='fischer'
        state=initial_state(opts)
        board=state['board']
        for row in board:
            for i in range(len(row)):
                row[i]=None
        board[7][6]={'type':'K','color':'red','moved':False,'promoted':False}
        board[7][7]={'type':'R','color':'red','moved':False,'promoted':False}
        # The king is already on g1 in Chess960. The rook is the fallback target.
        self.assertIn((7,7),legal_moves(state,7,6,'red'))
        move(state,(7,6),(7,7))
        self.assertEqual(board[7][6]['type'],'K')
        self.assertEqual(board[7][5]['type'],'R')
        self.assertTrue(next(h['castle'] for h in state['history'] if h['kind']=='move'))

    def test_cannot_castle_through_attack(self):
        opts=default_options();opts['mode']='duel'
        state=initial_state(opts)
        board=state['board']
        board[7][5]=None;board[7][6]=None
        board[0][5]={'type':'R','color':'yellow','moved':True,'promoted':False}
        for r in range(1,7):board[r][5]=None
        self.assertNotIn((7,6),legal_moves(state,7,4,'red'))

if __name__=='__main__':unittest.main()
