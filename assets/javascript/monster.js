class Monster {
    constructor(image, xPosition, yPosition, width, height, type, direction, health, strength) {
        this.image = image,
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.type = type;
        this.direction = direction;
        this.health = health;
        this.strength = strength;
    }
}

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