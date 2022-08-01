const startGameBtn = document.getElementById('start-game-btn');
const startGameScreen = document.getElementById('start-game-container');
const mainGameScreen = document.getElementById('main-game-container');
const gameOverScreen = document.getElementById('game-over-container');
const audio = new Audio('/assets/music/music.mp3');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let intervalId = 0;
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

const eleven = new Eleven(elevenCharacterImage, canvas.width/2 - elevenWidth/2, platformYPosition - elevenHeight + 17, elevenWidth, elevenHeight);

const monstersArray = [];
monstersArray.push(createMonster());

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
        monsterTypes[randomMonsterTypeIndex].name,
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
        startGame();
    });


    //   left right movement of eleven
    document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowRight" && eleven.xPosition + eleven.width < canvas.width) {
            eleven.image.src = '/assets/images/eleven-right.png';
            eleven.xPosition += 4;
        } else if (event.code === "ArrowLeft" && eleven.xPosition > 0) {
            eleven.image.src = '/assets/images/eleven-left.png';
            eleven.xPosition -= 4;
        }
    });


    function startGame() {
        // ctx.clearRect();
        console.log('in start function')
        startGameScreen.style.display = "none";
        mainGameScreen.style.display = "flex";
        canvas.style.display = "block";
        // draw background
        ctx.drawImage(background,0,0, canvas.width, canvas.height);

        // draw game platform
        ctx.drawImage(gamePlatformImage, platformXPosition, platformYPosition, canvas.width, platformHeight);

        // draw health bar
        healthBarImage.src = '/assets/images/healthbar-100.png';
        ctx.drawImage(healthBarImage, 25, 25, 200, 54);
        powerBarImage.src = '/assets/images/powerbar-100.png';
        ctx.drawImage(powerBarImage, 25, 80, 200, 54);

        // draw eleven character
        ctx.drawImage(eleven.image, eleven.xPosition, eleven.yPosition, eleven.width, eleven.height);

        // draw monsters
        for(let i = 0; i < monstersArray.length; i++) {
            ctx.drawImage(monstersArray[i].image, monstersArray[i].xPosition, monstersArray[i].yPosition, monstersArray[i].width, monstersArray[i].height);

            // monster movement
            if(monstersArray[i].direction === "right") {
                monstersArray[i].xPosition += 2;
            } else {
                monstersArray[i].xPosition -= 2;
            }

            // collision with monsters
            if (
                eleven.xPosition < monstersArray[i].xPosition + monstersArray[i].width - 32 &&
                eleven.xPosition + eleven.width > monstersArray[i].xPosition
            ) {
                isGameOver = true;
            }
        }
        // draw health bar
        // ctx.drawImage()
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

