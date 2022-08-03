const startGameBtn = document.querySelectorAll('.start-game-btn');
const startGameScreen = document.getElementById('start-game-container');
const mainGameScreen = document.getElementById('main-game-container');
const gameOverScreen = document.getElementById('game-over-container');
const displayFinalScore = document.getElementById('score');
const displayHighestScore = document.getElementById('highscore');

const themeAudio = new Audio('/assets/music/Stranger-Thing-theme-Song.mp3');
const gameAudio = new Audio('/assets/music/Running_Up_That_Hill.mp3');
const elevenAttackAudio = new Audio('/assets/music/scifi-laser.wav');
const monsterBite = new Audio('/assets/music/monster-bite.ogg');
const gameOverAudio = new Audio('/assets/music/game-over.wav');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let intervalId;
let scoreIntervalId;
let elevenPowerIntervalId;
let monsterCreateIntervalId;
let snackIntervalId;
let score;
let highScore = 0;
let isGameOver = false;
let powerBallsArr;
let monstersArray;

let platformXPosition = 0;
let platformYPosition = 470;
let platformHeight = 100;

const healthBarImage = new Image();
const powerBarImage = new Image();

let elevenWidth = 100;
let elevenHeight = 100;

const demogorgenType = new MonsterType("demogorgen", "/assets/images/demogorgen-left.png", "/assets/images/demogorgen-right.png", 150, 130, 100, 20);
const demodogType = new MonsterType("demodog", "/assets/images/demodog-left.png", "/assets/images/demodog-right.png", 80, 80, 50, 10);
const monsterTypes = [demogorgenType, demodogType];
const monsterDirection = ["right", "left"];

const gamePlatformImage = new Image();
gamePlatformImage.src = '/assets/images/game-platform.png';

const background = new Image();
background.src = '/assets/images/background.jpg';

const elevenCharacterImage = new Image();
elevenCharacterImage.src = '/assets/images/eleven-left.png';

const eleven = new Eleven(
        elevenCharacterImage,
        canvas.width/2 - elevenWidth/2,
        platformYPosition - elevenHeight + 17,
        elevenWidth,
        elevenHeight,
        "left"
    );

const snackImage = new Image();
snackImage.src = '/assets/images/eggo.png';
let snack;

function resetGame() {
    isGameOver = false;
    powerBallsArr = [];
    monstersArray = [];
    score = 0;
    eleven.xPosition = canvas.width/2 - elevenWidth/2;
    eleven.yPosition =  platformYPosition - elevenHeight + 17;
    eleven.health = 100;
    eleven.power = 100;
    snack = undefined;

    themeAudio.pause();
    gameAudio.currentTime = 0;
    gameAudio.play();
    
    // increases score at every second
    scoreIntervalId = setInterval(() => {
        score++;             
    }, 1000);

    // increases eleven's power every 2 seconds
    elevenPowerIntervalId = setInterval(() => {
        if(eleven.power < 100) { 
            eleven.power += 10
        }             
    }, 2000);  

    // create monster every 3 seconds
    monsterCreateIntervalId = setInterval(() => {
        monstersArray.push(createMonster());
        new Audio('/assets/music/monster-growl.wav').play();
    }, 3000);
    
    // create snack every 10 seconds
    snackIntervalId = setInterval(() => {
        if(snack === undefined) {
            snack = createSnack();
        }
    }, 10000);
}

function updateHealthBar() {
    if (eleven.health > 80 && eleven.health <= 100) {
        healthBarImage.src = '/assets/images/healthbar-100.png';
    } else if (eleven.health > 60 && eleven.health <= 80) {
        healthBarImage.src = '/assets/images/healthbar-80.png';
    } else if (eleven.health > 40 && eleven.health <=60) {
        healthBarImage.src = '/assets/images/healthbar-60.png';
    } else if (eleven.health > 20 && eleven.health <=40) {
        healthBarImage.src = '/assets/images/healthbar-40.png';
    } else if (eleven.health > 10 && eleven.health <=20) {
        healthBarImage.src = '/assets/images/healthbar-20.png';
    } else if (eleven.health > 0 && eleven.health <=10) {
        healthBarImage.src = '/assets/images/healthbar-10.png';
    } else if (eleven.health <= 0) {
        healthBarImage.src = '/assets/images/healthbar-0.png';
    }
    ctx.drawImage(healthBarImage, 25, 25, 200, 54);
}

function updatePowerBar() {
    if (eleven.power > 80 && eleven.power <= 100) {
        powerBarImage.src = '/assets/images/powerbar-100.png';
    } else if (eleven.power > 60 && eleven.power <= 80) {
        powerBarImage.src = '/assets/images/powerbar-80.png';
    } else if (eleven.power > 40 && eleven.power <=60) {
        powerBarImage.src = '/assets/images/powerbar-60.png';
    } else if (eleven.power > 20 && eleven.power <=40) {
        powerBarImage.src = '/assets/images/powerbar-40.png';
    } else if (eleven.power > 10 && eleven.power <=20) {
        powerBarImage.src = '/assets/images/powerbar-20.png';
    } else if (eleven.power > 0 && eleven.power <=10) {
        powerBarImage.src = '/assets/images/powerbar-10.png';
    } else if (eleven.power <= 0) {
        powerBarImage.src = '/assets/images/powerbar-0.png';
    }
    ctx.drawImage(powerBarImage, 25, 80, 200, 54);
}

function updateScoreDisplay() {
    ctx.fillText(`Score:`, canvas.width-200, 50);
    ctx.fillText(computeSixDigitScore(score), canvas.width-200, 90);
    ctx.fillStyle = "red";
    ctx.font = `30px Arcade`;
}

function computeSixDigitScore(score) {
    score = "00000" + score;
    return score.slice(score.length-6, score.length);
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
    return new PowerBall(powerBallPositionX, eleven.yPosition, 50, 50, eleven.direction, eleven.strength);
}

function createMonster() {
    let randomMonsterTypeIndex = Math.floor(Math.random() * monsterTypes.length);
    let monsterDirectionIndex = Math.floor(Math.random() * monsterDirection.length);
    let monsterXPosition = 0;

    let monsterImage = new Image();
    if(monsterDirection[monsterDirectionIndex] === 'right') {
        monsterImage.src = monsterTypes[randomMonsterTypeIndex].rightImageSrc;
        monsterXPosition = platformXPosition - 400;
    } else {
        monsterImage.src = monsterTypes[randomMonsterTypeIndex].leftImageSrc;
        monsterXPosition = canvas.width + 400;
    }

    return new Monster(
        monsterImage,
        monsterXPosition,
        platformYPosition - monsterTypes[randomMonsterTypeIndex].height,
        monsterTypes[randomMonsterTypeIndex].width, monsterTypes[randomMonsterTypeIndex].height,
        monsterTypes[randomMonsterTypeIndex],
        monsterDirection[monsterDirectionIndex],
        monsterTypes[randomMonsterTypeIndex].health,
        monsterTypes[randomMonsterTypeIndex].strength
    );
}

function createSnack() {
    let snakeXPosition = Math.floor(Math.random() * (canvas.width - 100));
    return new Snack(snackImage, snakeXPosition, 0, 50, 50, 25);
}

window.onload = () => {
    // play start screen music and show only splash screen
    
    startGameScreen.style.display = "flex";
    mainGameScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    canvas.style.display = "none";
    themeAudio.currentTime = 13;
    themeAudio.play();
    
    // when start game btn click hide splash screen and go to main game screen
    startGameBtn.forEach(item => {
        item.addEventListener('click', event => {
            resetGame();
            updateGame();
        });
        
      })
    


    //   left right movement of eleven
    document.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.code === "ArrowRight" && eleven.xPosition + eleven.width < canvas.width) {
            eleven.direction = "right";
            eleven.image.src = '/assets/images/eleven-right.png';
            eleven.xPosition += 4;
        } else if (event.code === "ArrowLeft" && eleven.xPosition > 0) {
            eleven.direction = "left";
            eleven.image.src = '/assets/images/eleven-left.png';
            eleven.xPosition -= 4;
        } else if (event.code === "Space") {
            const powerBall = createPowerBall();
            if (powerBall !== undefined) {
                powerBallsArr.push(powerBall);
            }
        }
    });


    function updateGame() {
        console.log('in start function')
        startGameScreen.style.display = "none";
        mainGameScreen.style.display = "flex";
        gameOverScreen.style.display = "none";
        canvas.style.display = "block";

        // draw background
        ctx.drawImage(background,0,0, canvas.width, canvas.height);

        // draw game platform
        ctx.drawImage(gamePlatformImage, platformXPosition, platformYPosition, canvas.width, platformHeight);

        // update score 
        updateScoreDisplay();

        // draw health bar
        updateHealthBar();
        
        // draw power bar
        updatePowerBar();

        // draw eleven character
        ctx.drawImage(eleven.image, eleven.xPosition, eleven.yPosition, eleven.width, eleven.height);

        // draw snack 
        if(snack != undefined) {
            ctx.drawImage(snack.image, snack.xPosition, snack.yPosition, snack.width, snack.height); 
            if (snack.yPosition + snack.height < platformYPosition) {
                snack.yPosition++; 
            }
            if (
                eleven.xPosition < snack.xPosition + snack.width - 50 && 
                eleven.xPosition + eleven.width - 50 > snack.xPosition &&
                eleven.yPosition < snack.yPosition + snack.height
                ) {
                eleven.health += snack.refill;
                snack = undefined;
            }
        }
        

        // draw power ball
        for(let i = 0; i < powerBallsArr.length; i++) {
            ctx.drawImage(powerBallsArr[i].image, powerBallsArr[i].xPosition, powerBallsArr[i].yPosition, powerBallsArr[i].width, powerBallsArr[i].height);
            
            // power ball movement
            if(powerBallsArr[i].direction === "right") {
                powerBallsArr[i].xPosition += 3;
            } else {
                powerBallsArr[i].xPosition -= 3;
            }

            // power ball canvas border check
            if(powerBallsArr[i].xPosition + powerBallsArr[i].width < 0 || powerBallsArr[i].xPosition > canvas.width) {
                powerBallsArr.splice(i,1);
                // i--;
                continue;
            }

            for(let j = 0; j < monstersArray.length; j++) {
                if (
                    powerBallsArr[i].xPosition < monstersArray[j].xPosition + monstersArray[j].width - 32 &&
                    powerBallsArr[i].xPosition + powerBallsArr[i].width > monstersArray[j].xPosition
                ) {
                    monstersArray[j].receiveAttack(powerBallsArr[i].strength);
                    powerBallsArr.splice(i, 1);
                    if (monstersArray[j].health <= 0) {
                        monstersArray.splice(j, 1);
                        new Audio('/assets/music/scream.wav').play();
                        score += 20;
                    }
                    break;
                } 
                
            }
        }

        // draw monsters
        for(let i = 0; i < monstersArray.length; i++) {
            ctx.drawImage(monstersArray[i].image, monstersArray[i].xPosition, monstersArray[i].yPosition, monstersArray[i].width, monstersArray[i].height);
            ctx.fillRect(monstersArray[i].xPosition+10, monstersArray[i].yPosition-15, monstersArray[i].health, 8);
            
            // monster movement
            if(monstersArray[i].xPosition > eleven.xPosition + eleven.width) {
                monstersArray[i].direction = "left";
                monstersArray[i].image.src = monstersArray[i].type.leftImageSrc;
            } else if(monstersArray[i].xPosition < eleven.xPosition) {
                monstersArray[i].direction = "right";
                monstersArray[i].image.src = monstersArray[i].type.rightImageSrc;
            }

            if(monstersArray[i].direction === "right") {
                monstersArray[i].xPosition += 2;
            } else {
                monstersArray[i].xPosition -= 2;
            }

            // eleven collision with monsters
            if (
                eleven.xPosition < monstersArray[i].xPosition + monstersArray[i].width - 32 &&
                eleven.xPosition + eleven.width > monstersArray[i].xPosition
            ) {
                // to make monster stop
                if(monstersArray[i].direction === "right") {
                    monstersArray[i].xPosition -= 2;
                } else {
                    monstersArray[i].xPosition += 2;
                }

                if (monstersArray[i].readyToAttack) {
                    console.log(eleven.receiveAttack(monstersArray[i].strength))
                    monstersArray[i].toggleReadyToAttack();
                    monsterBite.play();
                    setTimeout(() => {
                        monstersArray[i].toggleReadyToAttack();
                    }, 3000);
                    
                    if (eleven.health <= 0) {
                        isGameOver = true;
                    }
                }
            }
        }

        intervalId = requestAnimationFrame(updateGame);
        if (isGameOver) {
            gameOverAudio.play();
            themeAudio.currentTime = 10;
            themeAudio.play();
            gameAudio.pause();
            cancelAnimationFrame(intervalId);
            clearInterval(scoreIntervalId);
            clearInterval(elevenPowerIntervalId);
            clearInterval(monsterCreateIntervalId);
            clearInterval(snackIntervalId);
            // check highest score 
            highScore = score > highScore ? score : highScore;

            canvas.style.display = "none";
            mainGameScreen.style.display = "none";
            startGameScreen.style.display = "none";
            gameOverScreen.style.display = "flex";
            displayFinalScore.innerText = computeSixDigitScore(score); 
            displayHighestScore.innerHTML =  computeSixDigitScore(highScore);
        }

    }

    
};

