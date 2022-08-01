const startGameBtn = document.getElementById('start-game-btn');
const startGameScreen = document.getElementById('start-game-container');
const mainGameScreen = document.getElementById('main-game-container');
const gameOverScreen = document.getElementById('game-over-container');
const audio = new Audio('/assets/music/music.mp3');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let intervalId = 0;
let score = 0;
let isGameOver = false;

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

// charge eleven power
setInterval(() => {
    if(eleven.power < 100) { 
        eleven.power += 10
    }             
}, 2000);  

const powerBallsArr = [];

const monstersArray = [];
setInterval(() => {
    monstersArray.push(createMonster());
}, 3000);


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

window.onload = () => {
    // play start screen music and show only splash screen
    // audio.play();
    startGameScreen.style.display = "flex";
    mainGameScreen.style.display = "none";
    canvas.style.display = "none";
    
    // when start game btn click hide splash screen and go to main game screen
    startGameBtn.addEventListener('click', () => {
        // audio.pause();
        // score
        setInterval(() => {
            score++;             
        }, 1000);
        startGame();
    });


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


    function startGame() {
        //console.log('in start function')
        startGameScreen.style.display = "none";
        mainGameScreen.style.display = "flex";
        canvas.style.display = "block";

        // draw background
        ctx.drawImage(background,0,0, canvas.width, canvas.height);

        // draw game platform
        ctx.drawImage(gamePlatformImage, platformXPosition, platformYPosition, canvas.width, platformHeight);

        // score 
        ctx.fillText(`Score: ${score}`, canvas.width-100, 50);

        // draw health bar
        updateHealthBar();
        
        // draw power bar
        updatePowerBar();

        // draw eleven character
        ctx.drawImage(eleven.image, eleven.xPosition, eleven.yPosition, eleven.width, eleven.height);

        // draw power ball
        for(let i = 0; i < powerBallsArr.length; i++) {
            ctx.drawImage(powerBallsArr[i].image, powerBallsArr[i].xPosition, powerBallsArr[i].yPosition, powerBallsArr[i].width, powerBallsArr[i].height);
        
            // power ball movement
            if(powerBallsArr[i].direction === "right") {
                powerBallsArr[i].xPosition += 3;
            } else {
                powerBallsArr[i].xPosition -= 3;
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
                        score += 50;
                    }
                    break;
                } 
                
            }
        }

        // draw monsters
        for(let i = 0; i < monstersArray.length; i++) {
            ctx.drawImage(monstersArray[i].image, monstersArray[i].xPosition, monstersArray[i].yPosition, monstersArray[i].width, monstersArray[i].height);
            ctx.fillRect(monstersArray[i].xPosition+10, monstersArray[i].yPosition-15, monstersArray[i].health, 8);
            ctx.fillStyle = "red";
            
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
                    let attackInterval = setInterval(() => {
                        monstersArray[i].toggleReadyToAttack();
                    }, 3000);
                    
                    if (eleven.health <= 0) {
                        clearInterval(attackInterval);
                        isGameOver = true;
                    }
                }
            }
        }

        intervalId = requestAnimationFrame(startGame);
        if (isGameOver) {
            cancelAnimationFrame(intervalId);
            canvas.style.display = "none";
            mainGameScreen.style.display = "none";
            startGameScreen.style.display = "none";
            gameOverScreen.style.display = "block";
            // audio.muted();
        }

    }

    
};

