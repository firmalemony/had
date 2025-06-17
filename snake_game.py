import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_SIZE = 400
GRID_SIZE = 20
GRID_COUNT = WINDOW_SIZE // GRID_SIZE
SNAKE_COLOR = (0, 255, 0)  # Green
FOOD_COLOR = (255, 0, 0)   # Red
BACKGROUND_COLOR = (0, 0, 0)  # Black

# Set up the display
screen = pygame.display.set_mode((WINDOW_SIZE, WINDOW_SIZE))
pygame.display.set_caption('Snake Game')
clock = pygame.time.Clock()

class Snake:
    def __init__(self):
        self.positions = [(GRID_COUNT // 2, GRID_COUNT // 2)]
        self.direction = (1, 0)  # Start moving right
        self.length = 1
        self.score = 0

    def get_head_position(self):
        return self.positions[0]

    def move(self):
        cur = self.get_head_position()
        x, y = self.direction
        new = ((cur[0] + x) % GRID_COUNT, (cur[1] + y) % GRID_COUNT)
        
        if new in self.positions[2:]:
            return False  # Game over
        
        self.positions.insert(0, new)
        if len(self.positions) > self.length:
            self.positions.pop()
        return True

    def grow(self):
        self.length += 1
        self.score += 1

    def draw(self, surface):
        for p in self.positions:
            rect = pygame.Rect((p[0] * GRID_SIZE, p[1] * GRID_SIZE),
                             (GRID_SIZE, GRID_SIZE))
            pygame.draw.rect(surface, SNAKE_COLOR, rect)
            pygame.draw.rect(surface, (0, 200, 0), rect, 1)

class Food:
    def __init__(self):
        self.position = (0, 0)
        self.randomize_position()

    def randomize_position(self):
        self.position = (random.randint(0, GRID_COUNT-1),
                        random.randint(0, GRID_COUNT-1))

    def draw(self, surface):
        rect = pygame.Rect((self.position[0] * GRID_SIZE,
                          self.position[1] * GRID_SIZE),
                         (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(surface, FOOD_COLOR, rect)
        pygame.draw.rect(surface, (200, 0, 0), rect, 1)

def main():
    snake = Snake()
    food = Food()
    font = pygame.font.Font(None, 36)

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and snake.direction != (0, 1):
                    snake.direction = (0, -1)
                elif event.key == pygame.K_DOWN and snake.direction != (0, -1):
                    snake.direction = (0, 1)
                elif event.key == pygame.K_LEFT and snake.direction != (1, 0):
                    snake.direction = (-1, 0)
                elif event.key == pygame.K_RIGHT and snake.direction != (-1, 0):
                    snake.direction = (1, 0)

        # Move snake
        if not snake.move():
            # Game over
            text = font.render(f'Game Over! Score: {snake.score}', True, (255, 255, 255))
            text_rect = text.get_rect(center=(WINDOW_SIZE/2, WINDOW_SIZE/2))
            screen.blit(text, text_rect)
            pygame.display.flip()
            pygame.time.wait(2000)
            return

        # Check if snake ate food
        if snake.get_head_position() == food.position:
            snake.grow()
            food.randomize_position()
            while food.position in snake.positions:
                food.randomize_position()

        # Draw everything
        screen.fill(BACKGROUND_COLOR)
        snake.draw(screen)
        food.draw(screen)
        
        # Draw score
        score_text = font.render(f'Score: {snake.score}', True, (255, 255, 255))
        screen.blit(score_text, (10, 10))
        
        pygame.display.flip()
        clock.tick(10)  # Control game speed

if __name__ == '__main__':
    while True:
        main()
        # Wait for a key press to restart
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.KEYDOWN:
                    waiting = False 