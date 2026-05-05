board = [" " for _ in range(9)]

def check_winner(player):
    wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]
    return any(board[a]==board[b]==board[c]==player for a,b,c in wins)

def is_full():
    return " " not in board

def get_winning_cells(player):
    wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]
    for combo in wins:
        a,b,c = combo
        if board[a] == board[b] == board[c] == player:
            return combo
    return None