import pygame
from game import board

pygame.init()
pygame.mixer.init()

click_sound = pygame.mixer.Sound("assets/click.wav")
win_sound = pygame.mixer.Sound("assets/win.wav")
draw_sound = pygame.mixer.Sound("assets/draw.wav")

WIDTH = 300
HEIGHT = 350   # extra space for status
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Tic Tac Toe AI")

# Colors
BG_COLOR = (240, 240, 240)
LINE_COLOR = (50, 50, 50)
X_COLOR = (200, 0, 0)
O_COLOR = (0, 0, 200)

animations = {}  # store animation progress for each cell

def draw_board():
    screen.fill(BG_COLOR)

    # Grid lines
    for i in range(1,3):
        pygame.draw.line(screen, LINE_COLOR, (0,i*100),(300,i*100),3)
        pygame.draw.line(screen, LINE_COLOR, (i*100,0),(i*100,300),3)

def draw_marks():
    for i in range(9):
        if board[i] != " ":
            if i not in animations:
                animations[i] = 0

            animations[i] += 0.1
            progress = min(animations[i], 1)

            cx = (i % 3) * 100 + 50
            cy = (i // 3) * 100 + 50

            if board[i] == "X":
                draw_x(cx, cy, progress)
            else:
                draw_o(cx, cy, progress)
def draw_status(message):
    font = pygame.font.Font(None, 40)
    text = font.render(message, True, (0,0,0))
    screen.blit(text, (10, 310))

def draw_winning_line(cells):
    if not cells:
        return

    positions = [
        (50,50),(150,50),(250,50),
        (50,150),(150,150),(250,150),
        (50,250),(150,250),(250,250)
    ]

    start = positions[cells[0]]
    end = positions[cells[2]]

    pygame.draw.line(screen, (0,200,0), start, end, 5)

def draw_menu():
    screen.fill((240,240,240))
    font = pygame.font.Font(None, 50)

    mouse_x, mouse_y = pygame.mouse.get_pos()

    options = ["Easy AI", "Hard AI", "2 Player"]

    for i, option in enumerate(options):
        x = 60
        y = 60 + i*80
        width = 200
        height = 50

        rect = pygame.Rect(x, y, width, height)

        # Hover effect
        if rect.collidepoint(mouse_x, mouse_y):
            pygame.draw.rect(screen, (200,200,200), rect)
        else:
            pygame.draw.rect(screen, (220,220,220), rect)

        pygame.draw.rect(screen, (0,0,0), rect, 2)

        text = font.render(option, True, (0,0,0))
        screen.blit(text, (x+20, y+10))

def draw_x(cx, cy, progress):
    size = 30

    # first line
    pygame.draw.line(
        screen, (200,0,0),
        (cx-size, cy-size),
        (cx-size + (2*size*progress), cy-size + (2*size*progress)),
        4
    )

    # second line appears after half
    if progress > 0.5:
        p = (progress - 0.5) * 2
        pygame.draw.line(
            screen, (200,0,0),
            (cx+size, cy-size),
            (cx+size - (2*size*p), cy-size + (2*size*p)),
            4
        )


def draw_o(cx, cy, progress):
    radius = 30
    end_angle = progress * 360

    rect = pygame.Rect(cx-radius, cy-radius, radius*2, radius*2)
    pygame.draw.arc(screen, (0,0,200), rect, 0, end_angle * 3.14 / 180, 4)       