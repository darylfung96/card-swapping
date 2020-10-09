/**
 *  Card encapsulate the swap card as a class
 *
 * @param {string} imageLocation - the image location for this swap card
 * @param {int} speed - the speed to move the card (base on the total swaps required in 20 seconds)
 *                    - if more total swaps are needed, the speed will increase
 *                    - we will feed totalswaps into this card class and the card class will calculate the speed automatically
 */
function Card(imageLocation, speed) {
  const imageTexture = PIXI.Texture.fromImage(imageLocation);
  this.isTarget = false; // true if this card is one of the target card
  this.imageLocation = imageLocation;
  this.backImageLocation = 'resources/Cards/cardBack_blue5.png';
  this.guessImageLocation = 'resources/Cards/card-guessing.png';
  this.speed = speed;

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

/**
 * showGuessing shows the guessing box next to this target card
 *
 * @param {CardSwap} cardSwapContainer - the container of the CardSwap game
 */
Card.prototype.showGuessing = function (cardSwapContainer) {
  this.guessingSprite = PIXI.Sprite.fromImage(this.guessImageLocation);
  this.guessingSprite.x = this.x - this.width * 0.7;
  this.guessingSprite.y = this.y - this.height * 0.5;
  this.guessingSprite.anchor.set(0.5);
  this.guessingSprite.scale.set(0.35);
  this.isGuessing = true;
  cardSwapContainer.addChild(this.guessingSprite);
};

/**
 * flipCard flips the swap card. Manupulate the variable isFlipping from the CardSwap container once the swap card is done flipping
 * to let CardSwap container know that it has done flipping
 *
 * @param {CardSwap} cardSwapContainer - the container of the CardSwap game
 */
Card.prototype.flipCard = function (cardSwapContainer) {
  const originalWidth = this.width;
  const self = this;
  // start flipping card
  const startFlipInterval = setInterval(() => {
    if (self.width > 3) self.width -= originalWidth * 0.02;
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
      if (self.width < originalWidth) self.width += originalWidth * 0.02;
      else {
        clearInterval(startFlipOpenInterval);
        self.width = originalWidth;
        cardSwapContainer.isFlipping = false;
        self.isFront = !self.isFront;
      }
    }, 10);
  }
};

// swap the card position with the cardToSwapPosition
// cardSwapContainer is the CardSwap container
// we pass cardSwapContainer in so we can increase the cardsDoneSwapping variable when this card is done swapping
// so we know we can swap again
/**
 *  swapPosition swap the card position of this swap card. The cardSwapContainer is passed so this function can let the
 * CardSwapContainer know that this card has done swapping its position.
 *
 * @param {array} cardToSwapPosition - the location to swap to - [x, y]
 * @param {CardSwap} cardSwapContainer - the container for the CardSwam game
 */
Card.prototype.swapPosition = function (cardToSwapPosition, cardSwapContainer) {
  const newXPosition = cardToSwapPosition[0];
  const newYPosition = cardToSwapPosition[1];
  const self = this;

  const deltaX = (newXPosition - self.x) / (8 * this.speed);
  const deltaY = (newYPosition - self.y) / (8 * this.speed);

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
/**
 * TargetCard encapsulates the target cards in a class
 *
 * @param {string} imageLocation - the location for the image of the target card
 */
function TargetCard(imageLocation) {
  const imageTexture = PIXI.Texture.fromImage(imageLocation);
  this.imageLocation = imageLocation;
  this.lastXposition = 0;
  this.lastYposition = 0;
  this.guessedScore = 0; // the score guessed by the user (1,2,3)
  this.scoreSprite = null;
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

/**
 * setGuessScore show the score next to this target card after it has been placed into the guessing box
 *
 * @param {int} score - The score guessed for this target card
 */
TargetCard.prototype.setGuessScore = function (score) {
  this.guessedScore = score;
  this.scoreSprite = new PIXI.Text(score.toString(), {
    fill: '#fff',
    fontSize: 25,
  });
  this.scoreSprite.x = this.x - this.width;
  this.scoreSprite.y = this.y;
  this.scoreSprite.anchor.set(0.5);
};
