class Snack {
    constructor(canvasWidth) {
        const snackImage = new Image();
        snackImage.src = '/assets/images/eggo.png';

        this.image = snackImage;
        this.xPosition = Math.floor(Math.random() * (canvasWidth - 100));
        this.yPosition = 0;
        this.width = 50;
        this.height = 50;
        this.refill = 25;
    }

    
}