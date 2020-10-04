function Card(imageLocation) {
  const imageTexture = PIXI.Texture.fromImage(imageLocation);
  this.isTarget = false;
  this.imageLocation = imageLocation;
  this.backImageLocation = 'resources/Cards/CardBack_blue5.png';

  // isFront, it will show the front of the card and not the back of the card
  this.isFront = true;

  PIXI.Sprite.call(this, imageTexture);
}
Card.prototype = Object.create(PIXI.Sprite.prototype);

Card.prototype.setTarget = function (isTarget) {
  this.isTarget = isTarget;
};
Card.prototype.isTarget = function () {
  return this.isTarget;
};

// isFlipping is the boolean variable passed from the cardSwap container, to let cardSwapContainer
// know when the flipping is done, so we can start swapping card positions
Card.prototype.flipCard = function (cardSwapContainer) {
  const originalWidth = this.width;
  const self = this;
  // start flipping card
  const startFlipInterval = setInterval(() => {
    if (self.width > 1) self.width -= originalWidth * 0.02;
    else {
      // change flipping card sprite
      self.texture = PIXI.Texture.fromImage(
        self.isFront ? self.backImageLocation : self.imageLocation
      );
      clearInterval(startFlipInterval);
      startFlipOpen();
    }
  }, 10);

  // start flipping open card
  function startFlipOpen() {
    const startFlipOpenInterval = setInterval(() => {
      if (self.width < originalWidth) self.width += 1;
      else {
        clearInterval(startFlipOpenInterval);
        this.width = originalWidth;
        cardSwapContainer.isFlipping = false;
        self.isFront = false;
      }
    }, 10);
  }
};
Card.prototype.swapPosition = function (cardToSwapPosition, cardSwapContainer) {
  const newXPosition = cardToSwapPosition[0];
  const newYPosition = cardToSwapPosition[1];
  const self = this;

  const deltaX = (newXPosition - self.x) / 100;
  const deltaY = (newYPosition - self.y) / 100;

  const swapInterval = setInterval(() => {
    if (Math.abs(self.x - newXPosition) >= 0.01) {
      self.x += deltaX;
    }
    if (Math.abs(self.y - newYPosition) >= 0.01) {
      self.y += deltaY;
    }

    if (
      Math.abs(self.x - newXPosition) < 0.01 &&
      Math.abs(self.y - newYPosition) < 0.01
    ) {
      clearInterval(swapInterval);
      cardSwapContainer.cardsDoneSwapping += 1; // let container know that swapping is done
      self.x = newXPosition;
      self.y = newYPosition;
    }
  }, 10);
};

/******************** Target Card ********************/
function TargetCard(imageLocation) {
  const imageTexture = PIXI.Texture.fromImage(imageLocation);
  this.imageLocation = imageLocation;
  this.lastXposition = 0;
  this.lastYposition = 0;
  PIXI.Sprite.call(this, imageTexture);
}
TargetCard.prototype = Object.create(PIXI.Sprite.prototype);

TargetCard.prototype.setX = function (newX) {
  this.x = newX;
};
TargetCard.prototype.setY = function (newY) {
  this.y = newY;
};
TargetCard.prototype.setLocation = function (newX, newY) {
  this.x = newX;
  this.y = newY;
};
TargetCard.prototype.setLastLocation = function (lastX, lastY) {
  this.lastXposition = lastX;
  this.lastYposition = lastY;
};
