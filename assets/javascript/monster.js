class MonsterType {
    constructor(name, leftImageSrc, rightImageSrc, width, height, health, strength) {
        this.name = name;
        this.leftImageSrc = leftImageSrc;
        this.rightImageSrc = rightImageSrc;
        this.width = width;
        this.height = height;
        this.health = health;
        this.strength = strength;
    }
}

const demogorgenType = new MonsterType("demogorgen", "assets/images/demogorgen-left.png", "assets/images/demogorgen-right.png", 150, 130, 100, 20);
const demodogType = new MonsterType("demodog", "assets/images/demodog-left.png", "assets/images/demodog-right.png", 80, 80, 50, 10);
const monsterTypes = [demogorgenType, demodogType];
const monsterDirection = ["right", "left"];

class Monster {
    constructor(canvasWidth, platformYPosition) {
        let randomMonsterTypeIndex = Math.floor(Math.random() * monsterTypes.length);
        let monsterDirectionIndex = Math.floor(Math.random() * monsterDirection.length);
        let monsterXPosition;
        let monsterImage = new Image();

        if(monsterDirection[monsterDirectionIndex] === 'right') {
            monsterImage.src = monsterTypes[randomMonsterTypeIndex].rightImageSrc;
            monsterXPosition = -400;
        } else {
            monsterImage.src = monsterTypes[randomMonsterTypeIndex].leftImageSrc;
            monsterXPosition = canvasWidth + 400;
        }

        this.image = monsterImage;
        this.xPosition = monsterXPosition;
        this.yPosition = platformYPosition - monsterTypes[randomMonsterTypeIndex].height;
        this.width = monsterTypes[randomMonsterTypeIndex].width;
        this.height = monsterTypes[randomMonsterTypeIndex].height;
        this.type = monsterTypes[randomMonsterTypeIndex];
        this.direction = monsterDirection[monsterDirectionIndex];
        this.health = monsterTypes[randomMonsterTypeIndex].health;
        this.strength = monsterTypes[randomMonsterTypeIndex].strength;
        this.readyToAttack = true;
    }

    draw() {
        ctx.drawImage(this.image, this.xPosition, this.yPosition, this.width, this.height);
    }

    drawHealthBar() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.xPosition+10, this.yPosition-15, this.health, 8);
    }

    move() {
        this.moveIntervalId = setInterval(() => {
            if (this.direction === "right") {
                this.xPosition += 0.5;
            } else {
                this.xPosition -= 0.5;
            }            
        }, 1);
    }

    changeDirection(elevenXPosition, elevenWidth) {
        if (this.xPosition > elevenXPosition + elevenWidth) {
            this.direction = "left";
            this.image.src = this.type.leftImageSrc;
        } else if(this.xPosition < elevenXPosition) {
            this.direction = "right";
            this.image.src = this.type.rightImageSrc;
        }
    }

    toggleReadyToAttack() {
        return this.readyToAttack = !this.readyToAttack;
    }
    
    receiveAttack(strength) {
        return this.health -= strength;
    }    
}

