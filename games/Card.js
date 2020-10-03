function Card(imageLocation) {
  const imageTexture = PIXI.Texture.fromImage(imageLocation);
  this.isTarget = false;
  this.imageLocation = imageLocation;
  this.backImageLocation = 'resources/Cards/CardBack_blue5.png';
  PIXI.Sprite.call(this, imageTexture);
}
Card.prototype = Object.create(PIXI.Sprite.prototype);

Card.prototype.setTarget = function (isTarget) {
  this.isTarget = isTarget;
};
Card.prototype.isTarget = function () {
  return this.isTarget;
};
Card.prototype.flipCard = function () {
  const originalWidth = this.width;
  const self = this;
  // start flipping card
  const startFlipInterval = setInterval(() => {
    if (self.width > 1) self.width -= 1;
    else {
      // change flipping card sprite
      self.texture = PIXI.Texture.fromImage(this.backImageLocation);
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
      }
    }, 10);
  }
};

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
