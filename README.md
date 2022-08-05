# StrangerThingsGame

[Click here to see deployed game](https://sunairaa.github.io/StrangerThingsGame/)

## Description
Main objective of game is to kill monsters 👹, survive as long as you can and beat the highest score 💯. Score is going to increase as long as you survive and if you kill monster you will get extra points 🔥.

## MVP
- Design splash screen with start game button.
- Draw canvas for game screen.
- Draw game platform.
- Draw main character named Eleven.
- Generate randomly 2 types of monsters they may come randomly from left or right direction.
- Eleven can kill monster with power ball.
- Maintain health bar and power bar for main character.
- Increase power bar by some time.
- Maintain score board.
- Maintain health for monsters.
- Game over when main character's health is zero.
- Design game over page with restart game again button.

## Bonus
- Add music on different ocassions.
- Generate snack for main character by eating snack health can increase.
- Highest score with local storage.
- Increase challenge level.

## Backlog
- level up features.
- Add some animation in canvas on killing monsters like some blast effect and blood drops.

## Data structure
- Eleven
- PowerBall
- Monster
- MonsterType
- Snack

## States y States Transitions
- Splash Screen
- Main Game Screen
- Game Over Screen

## script.js
- Script - build dom
- Script - display splash screen
- Script - addEventLisitener to start game.
- Script - draw canvas.
- Script - draw game platform.
- Script - display game over screen.
- Script - background image.
- Script - design game platform.
- Script - update game.
- Script - collision between monster and eleven.
- Script - collision between monster and power ball.
- Script - update score.
- Script - game reset.
- Script - add different musics.
- Script - collision between snack and Eleven.
- Script - update Eleven health bar on snack eating.
- Script - update highest score with local storage.

## eleven.js
- Eleven - draw.
- Eleven - move right and left.
- Eleven - receive attack from monsters.
- Eleven - update health bar.
- Eleven - update power bar.
- Eleven - reset Eleven position on game reset.
- Eleven - increase power bar after some specific time.
- PowerBall - draw.
- PowerBall - move powerball to attack monster.

## monster.js
- Monster - draw monster.
- Monster - move monster.
- MonsterType - generate 2 type of monster with some different properties.
- Monter - generate monster randomly from left right side.
- Monster - receive attack from eleven and update health.
- Monster - ready to attack after some time.
- Monster - follow main character by changing monster direction.

## snack.js
- Snack - draw snack.

## Task
- Script - build dom
- Script - display splash screen
- Script - addEventLisitener to start game.
- Script - display game over screen.
- Script - background image.
- Script - design game platform.
- Eleven - draw.
- Eleven - move right and left.
- Script - update game.
- Monster - draw monster.
- Monster - move monster.
- MonsterType - generate 2 type of monster with some different properties.
- Monter - generate monster randomly from left right side.
- Script - collision between monster and eleven.
- Eleven - receive attack from monsters.
- Eleven - update health bar.
- PowerBall - draw.
- PowerBall - move powerball to attack monster.
- Script - collision between monster and power ball.
- Monster - receive attack from eleven and update health.
- Eleven - update power bar.
- Monster - ready to attack after some time.
- Monster - follow main character by changing monster direction.
- Eleven - increase power bar after some specific time.
- Script - update score.
- Script - game reset.
- Script - add different musics.
- Snack - draw snack.
- Script - collision between snack and Eleven.
- Script - update Eleven health bar on snack eating.
- Script - update highest score with local storage.

## Links
- [Slides Link](https://docs.google.com/presentation/d/13M787YMHfDrreWaY82At0WEf3GRoNBwacFrZPdh-LwA/edit?usp=sharing)
- [Github repository Link](https://github.com/Sunairaa/StrangerThingsGame)
- [Deployment Link](https://sunairaa.github.io/StrangerThingsGame/)