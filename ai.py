import math
import random
from game import board, check_winner, is_full

def minimax(is_max):
    if check_winner("O"): return 1
    if check_winner("X"): return -1
    if is_full(): return 0

    if is_max:
        best = -math.inf
        for i in range(9):
            if board[i] == " ":
                board[i] = "O"
                score = minimax(False)
                board[i] = " "
                best = max(best, score)
        return best
    else:
        best = math.inf
        for i in range(9):
            if board[i] == " ":
                board[i] = "X"
                score = minimax(True)
                board[i] = " "
                best = min(best, score)
        return best

def ai_move(mode="hard"):
    if mode == "easy":
        empty = [i for i in range(9) if board[i] == " "]
        move = random.choice(empty)
        board[move] = "O"
    else:
        best_score = -math.inf
        move = 0
        for i in range(9):
            if board[i] == " ":
                board[i] = "O"
                score = minimax(False)
                board[i] = " "
                if score > best_score:
                    best_score = score
                    move = i
        board[move] = "O"