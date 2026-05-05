import pygame
from gui import screen, draw_board, draw_marks, draw_status, draw_winning_line, draw_menu, animations, click_sound, win_sound, draw_sound
from game import board, check_winner, is_full, get_winning_cells
from ai import ai_move

pygame.init()

running = True

game_state = "menu"   # menu or playing
mode = None           # easy, hard, two

player_turn = True
game_over = False
winner_cells = None
status = ""

while running:
    if game_state == "menu":
        draw_menu()
        pygame.display.update()

    elif game_state == "playing":
        draw_board()
        draw_marks()

        if winner_cells:
            draw_winning_line(winner_cells)

        draw_status(status)
        pygame.display.update()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        # MENU CLICK
        if game_state == "menu" and event.type == pygame.MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()

            if 60 < y < 110:
                mode = "easy"
            elif 140 < y < 190:
                mode = "hard"
            elif 220 < y < 270:
                mode = "two"

            if mode:
                game_state = "playing"
                status = "Player X turn"
                player_turn = True
                game_over = False
                winner_cells = None

                for i in range(9):
                    board[i] = " "

                animations.clear()

        # GAME CLICK
        elif game_state == "playing" and event.type == pygame.MOUSEBUTTONDOWN:
            if game_over:
                animations.clear()
                game_state = "menu"
                continue

            x, y = pygame.mouse.get_pos()

            if y < 300:
                index = (y // 100) * 3 + (x // 100)

                if board[index] == " ":
                    if mode == "two":
                        board[index] = "X" if player_turn else "O"
                        click_sound.play()   # 🔊 sound added
                        player_turn = not player_turn
                        status = "Player X turn" if player_turn else "Player O turn"
                    else:
                        if player_turn:
                            board[index] = "X"
                            click_sound.play()   # 🔊 sound added
                            player_turn = False
                            status = "AI thinking..."

    # AI MOVE
    if game_state == "playing" and mode in ["easy", "hard"]:
        if not player_turn and not game_over:
            ai_move(mode)
            click_sound.play()   # 🔊 AI move sound
            player_turn = True
            status = "Your turn"

    # CHECK GAME STATUS
    if game_state == "playing":
        if check_winner("X") and not game_over:
            win_sound.play()   # 🏆 play once
            winner_cells = get_winning_cells("X")
            game_over = True
            status = "Player X Wins! Click to menu"

        elif check_winner("O") and not game_over:
            win_sound.play()   # 🏆 play once
            winner_cells = get_winning_cells("O")
            game_over = True
            status = "Player O Wins!" if mode == "two" else "AI Wins!"

        elif is_full() and not game_over:
            draw_sound.play()   # 🤝 draw sound
            game_over = True
            status = "Draw! Click to menu"