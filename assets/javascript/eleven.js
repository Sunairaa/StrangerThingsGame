class Eleven {
    constructor(image, xPosition, yPosition, width, height, direction) {
        this.image = image;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.health = 100;
        this.strength = 50;
        this.power = 100;
        this.direction = direction;
    }

    receiveAttack(strength) {
        return this.health -= strength;
    }
}

class PowerBall {
    constructor(xPosition, yPosition, width, height, direction, strength) {
        const powerBallImage = new Image();
        powerBallImage.src = '/assets/images/lightning-ball.gif';
        this.image = powerBallImage;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.strength = strength;
    }
}