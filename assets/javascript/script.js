const startGameBtn = document.querySelectorAll('.start-game-btn');
const startGameScreen = document.getElementById('start-game-container');
const mainGameScreen = document.getElementById('main-game-container');
const gameOverScreen = document.getElementById('game-over-container');
const displayFinalScore = document.getElementById('score');
const displayHighestScore = document.getElementById('highscore');
const musicBtn = document.getElementById('music-btn');
const musicImg = document.getElementById('music-img');

const themeAudio = new Audio('assets/music/Stranger-Thing-theme-Song.mp3');
const gameAudio = new Audio('assets/music/Running_Up_That_Hill.mp3');
const elevenAttackAudio = new Audio('assets/music/scifi-laser.wav');
const elevenEatingAudio = new Audio('assets/music/eating.mp3');
const monsterGrowlAudio = new Audio('assets/music/monster-growl.wav');
const monsterBiteAudio = new Audio('assets/music/monster-bite.ogg');
const gameOverAudio = new Audio('assets/music/game-over.wav');
themeAudio.currentTime = 20;
themeAudio.volume = 0.2;
gameAudio.volume = 0.2;
elevenAttackAudio.volume = 0.2;
elevenEatingAudio.volume = 0.2;
monsterGrowlAudio.volume = 0.2;
monsterBiteAudio.volume = 0.2;
gameOverAudio.volume = 0.2;

const canvas = document.querySelector('canvas');
canvas.width = screen.width;
canvas.height = screen.height;
const ctx = canvas.getContext('2d');

let intervalId;
let scoreIntervalId;
let monsterCreateIntervalId;
let snackIntervalId;
let score;
let highScore = localStorage.getItem('Highscore');
let powerBallsArr;
let monstersArray;
let isGameOver = false;
let sound = false;
let snack;

// game platform
let platformHeight = 100;
let platformXPosition = 0;
let platformYPosition = screen.height-platformHeight;
const gamePlatformImage = new Image();
gamePlatformImage.src = 'assets/images/game-platform.png';

// game background
const background = new Image();
background.src = 'assets/images/background.jpg';

// instantiate eleven object
const eleven = new Eleven( canvas.width/2 - this.width/2, platformYPosition - this.height + 17);

// reset game on game over screen.
function resetGame() {
    isGameOver = false;
    powerBallsArr = [];
    monstersArray = [];
    score = 0;

    // reset eleven position
    eleven.reset(canvas.width, platformYPosition);
    snack = undefined;

    // update music
    themeAudio.pause();
    gameAudio.currentTime = 0;
    gameAudio.play();
    
    // increases score at every second
    scoreIntervalId = setInterval(() => {
        score++;             
    }, 1000);

    // increases eleven's power every 2 seconds 
    eleven.setPowerInterval();

    // generate random monster on every 3 seconds.
    monsterCreateIntervalId1 = createMonsterInterval(3000);

    // generate random monster on every 5 seconds.
    monsterCreateIntervalId2 = createMonsterInterval(5000);

    // create monster every 3 and 5 seconds and push into array, and move monsters.
    function createMonsterInterval(interval) {
        return setInterval(() => {
            let monster = createMonster();
            monstersArray.push(monster);
            monsterGrowlAudio.play();
            monster.move();
        }, interval);
    }
    
    // create snack every 10 seconds
    snackIntervalId = setInterval(() => {
        if(snack === undefined) {
            snack = createSnack();
        }
    }, 20000);
}


function updateScoreDisplay() {
    ctx.fillStyle = "red";
    ctx.fillText(`Score:`, canvas.width-200, 50);
    ctx.fillText(computeSixDigitScore(score), canvas.width-200, 90);
    ctx.font = `30px Arcade`;
}

function computeSixDigitScore(score) {
    score = "00000" + score;
    return score.slice(score.length-6, score.length);
}

function createMonster() {
    return new Monster(canvas.width, platformYPosition);
}

function createPowerBall() {
    if (eleven.power <= 0) {
        return;
    }
    eleven.power -= 10;
    let powerBallPositionX; 
    if (eleven.direction === 'right') {
        powerBallPositionX = eleven.xPosition + eleven.width - 25;
    } else {
        powerBallPositionX = eleven.xPosition - 15;
    }
    elevenAttackAudio.currentTime = 0;
    elevenAttackAudio.play();
    return new PowerBall(powerBallPositionX, eleven.yPosition, eleven.direction, eleven.strength);
}

function createSnack() {
    return new Snack(canvas.width);
}

function playSoundOnStartScreen() {
    sound = !sound;
    if(sound) {
        musicImg.src = 'assets/images/music.png'; 
        themeAudio.play();
    } else {
        musicImg.src = 'assets/images/no-music.png'; 
        themeAudio.pause();
    }
}

function gameOver() {
    // update music
    gameOverAudio.play();
    themeAudio.currentTime = 10;
    themeAudio.play();
    gameAudio.pause();

    // clear intervals
    cancelAnimationFrame(intervalId);
    clearInterval(scoreIntervalId);
    eleven.clearPowerInterval();
    clearInterval(monsterCreateIntervalId1);
    clearInterval(monsterCreateIntervalId2);
    clearInterval(snackIntervalId);

    // check highest score and display score board
    highScore = score > highScore ? score : highScore;
    localStorage.setItem('Highscore', highScore);
    displayFinalScore.innerText = computeSixDigitScore(score); 
    displayHighestScore.innerHTML =  computeSixDigitScore(highScore);

    // display game over screen and hide all other screens.
    canvas.style.display = "none";
    mainGameScreen.style.display = "none";
    startGameScreen.style.display = "none";
    gameOverScreen.style.display = "flex";
}

window.onload = () => {
    //display only splash screen
    startGameScreen.style.display = "flex";
    mainGameScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    canvas.style.display = "none";

    // play start screen music on button click
    musicBtn.addEventListener('click', playSoundOnStartScreen);
    
    // when start game btn click hide splash screen and go to main game screen
    startGameBtn.forEach(item => {
        item.addEventListener('click', event => {
            resetGame();
            updateGame();
        });    
    })
    
    // left right movement of eleven
    document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowRight") {
            eleven.moveRight(canvas.width);
        } else if (event.code === "ArrowLeft") {
            eleven.moveLeft();
        } else if (event.code === "Space") {
            const powerBall = createPowerBall();
            if (powerBall !== undefined) {
                powerBallsArr.push(powerBall);
            }
        }
    });

    function updateGame() {
        startGameScreen.style.display = "none";
        mainGameScreen.style.display = "flex";
        gameOverScreen.style.display = "none";
        canvas.style.display = "flex";

        // draw background
        ctx.drawImage(background,0,0, canvas.width, canvas.height);

        // draw game platform
        ctx.drawImage(gamePlatformImage, platformXPosition, platformYPosition, canvas.width, platformHeight);

        // draw eleven character
        eleven.draw();

        // update score 
        updateScoreDisplay();

        // draw health bar
        eleven.updateHealthBar();
        
        // draw power bar
        eleven.updatePowerBar();

        // draw snack 
        if(snack != undefined) {
            ctx.drawImage(snack.image, snack.xPosition, snack.yPosition, snack.width, snack.height); 
            // move snack from top to bottom.
            if (snack.yPosition + snack.height < platformYPosition) {
                snack.yPosition++; 
            }

            // collision of eleven with snack, update health of eleven.
            if (
                eleven.xPosition < snack.xPosition + snack.width - 50 && 
                eleven.xPosition + eleven.width - 50 > snack.xPosition &&
                eleven.yPosition < snack.yPosition + snack.height
                ) {
                    if(eleven.health < 100) {
                        eleven.health += snack.refill;
                        if(eleven.health > 100) {
                            eleven.health = 100;
                        }
                    }
                elevenEatingAudio.play();
                snack = undefined;
            }
        }
        

        // draw power ball
        for(let i = 0; i < powerBallsArr.length; i++) {
            // draw powerball
            powerBallsArr[i].draw();

            // move power ball
            powerBallsArr[i].move();

            // if power ball is going to out of canvas width it should remove from array.
            if(powerBallsArr[i].xPosition + powerBallsArr[i].width < 0 || powerBallsArr[i].xPosition > canvas.width) {
                powerBallsArr.splice(i,1);
                continue;
            }

            // collision of power ball with monster --> to kill monster with power ball
            for(let j = 0; j < monstersArray.length; j++) {
                if (
                    powerBallsArr[i].xPosition < monstersArray[j].xPosition + monstersArray[j].width - 32 &&
                    powerBallsArr[i].xPosition + powerBallsArr[i].width > monstersArray[j].xPosition
                ) {
                    monstersArray[j].receiveAttack(powerBallsArr[i].strength);
                    powerBallsArr.splice(i, 1);
                    // if monster health is zero then remove monster array.
                    if (monstersArray[j].health <= 0) {
                        monstersArray.splice(j, 1);
                        new Audio('assets/music/scream.wav').play();
                        score += 20;
                    }
                    break;
                } 
                
            }
        }

        // draw monsters
        for(let i = 0; i < monstersArray.length; i++) {
            monstersArray[i].draw();
            monstersArray[i].drawHealthBar();
            monstersArray[i].changeDirection(eleven.xPosition, eleven.width);

            // eleven collision with monsters
            if (
                eleven.xPosition < monstersArray[i].xPosition + monstersArray[i].width - 32 &&
                eleven.xPosition + eleven.width - 32 > monstersArray[i].xPosition
            ) {
                // to make monster stop
                if(monstersArray[i].direction === "right") {
                    monstersArray[i].xPosition -= 2;
                } else {
                    monstersArray[i].xPosition += 2;
                }

                // when monster attack to eleven
                if (monstersArray[i].readyToAttack) {
                    eleven.receiveAttack(monstersArray[i].strength);
                    monstersArray[i].toggleReadyToAttack();
                    monsterBiteAudio.play();
                    setTimeout(() => {
                        monstersArray[i].toggleReadyToAttack();
                    }, 3000);
                    
                    // game over when eleven's health zero on monster attack.
                    if (eleven.health <= 0) {
                        isGameOver = true;
                    }
                }
            }
        }

        // update game/
        intervalId = requestAnimationFrame(updateGame);

        // if game over then invoke game over function
        if (isGameOver) {
            gameOver();
        }
    }
};