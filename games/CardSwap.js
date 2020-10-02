function CardSwap(screenWidth, screenHeight) {
  GameContainer.call(this, screenWidth, screenHeight);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.shapesBackgroundX = this.screenWidth / 2;
  this.shapesBackgroundY = this.screenHeight / 2;
  this.shapesBackgroundWidth = this.screenWidth / 2;
  this.shapesBackgroundHeight = this.screenHeight / 2;

  this.NUM_CHOICES_SHAPES = [2, 3];
  this.SHAPES_MIN_SIZE = 30;
  this.SHAPES_MAX_SIZE = 50;
  this.AVAILABLE_SHAPES = ['square', 'circle', 'triangle'];
  this.COLORS = [0xf8b195, 0xf67280, 0xc06c84, 0x6c5b7b, 0x355c7d];
  this.NUM_WRONG_BEFORE_REDUCING_SCORE = 3;

  this.countdown = 3;

  this.previousNumShapes = 0;
  this.currentNumShapes = 0;

  this.numCorrect = 0;
  this.consecutiveCorrect = 0;
  this.wrongAnswerNoConsecutiveCorrect = 0;

  this.currentDrawnShapes = [];

  // set the audio
  this.correctAudio = new Audio('resources/audio/correct.mp3');
  this.incorrectAudio = new Audio('resources/audio/incorrect.mp3');

  this._initialize();
}
CardSwap.prototype = Object.create(GameContainer.prototype);

CardSwap.prototype.endSpeedyGame = function () {
  this.leftArrow.unsubscribe();
  this.rightArrow.unsubscribe();

  if (this.startCountdown) {
    clearInterval(this.startCountdown);
  }

  this._drawEndMenu();
};

CardSwap.prototype._checkIntersection = function (a, b) {
  var ab = a.getBounds();
  var bb = b.getBounds();
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  );
};

CardSwap.prototype._drawEndMenu = function () {
  this.endBackground = new PIXI.Sprite.fromImage('resources/bg/black_bg.jpg');
  this.endBackground.width = this.screenWidth;
  this.endBackground.height = this.screenHeight;
  this.endBackground.alpha = 0.5;

  const textStyle = {
    fontSize: 40,
    fill: '#ffffff',
    align: 'center',
  };
  this.endMenu = new PIXI.Text('Game Ended', textStyle);
  this.endMenu.x = this.screenWidth / 2;
  this.endMenu.y = this.screenHeight * 0.2;
  this.endMenu.anchor.set(0.5);

  this.endDescription = new PIXI.Text(`You scored ${this.score}!`, textStyle);
  this.endDescription.x = this.screenWidth / 2;
  this.endDescription.y = this.screenHeight * 0.3;
  this.endDescription.anchor.set(0.5);

  const endButtonX = this.screenWidth / 2;
  const endButtonY = this.screenHeight * 0.6;

  const refreshButtonX = this.screenWidth / 2;
  const refreshButtonY = this.screenHeight * 0.5;

  const refreshCallback = () => {
    this.removeChildren(0, this.children.length);
    this._initializeContainer();
    this._initialize();
  };

  this.refreshButton = ButtonFactoryText(
    refreshButtonX,
    refreshButtonY,
    'Replay Game',
    {
      ...textStyle,
      fontSize: 30,
    },
    refreshCallback
  );

  this.endButton = ButtonFactoryText(
    endButtonX,
    endButtonY,
    'Exit Game',
    {
      ...textStyle,
      fontSize: 30,
    },
    exitCallback
  );

  this.addChild(this.endBackground);
  this.addChild(this.endMenu);
  this.addChild(this.endDescription);
  this.addChild(this.refreshButton);
  this.addChild(this.endButton);
};

CardSwap.prototype._createBackground = function () {
  var bg = new PIXI.Sprite.fromImage('resources/bg/wooden.jpeg');
  bg.alpha = 0.9;
  bg.width = this.screenWidth;
  bg.height = this.screenHeight;
  this.addChild(bg);
};

CardSwap.prototype._addScore = function () {
  if (this.consecutiveCorrect <= 5) {
    this.score += 50;
  } else if (this.consecutiveCorrect > 5) {
    this.score += 80;
  } else if (this.consecutiveCorrect > 10) {
    this.score += 150;
  } else if (this.consecutiveCorrect > 15) {
    this.score += 300;
  }
  this._createScoreText();
};

CardSwap.prototype._createKeyboardInput = function () {
  this.leftArrow = keyboard('ArrowLeft');
  this.rightArrow = keyboard('ArrowRight');

  this.leftArrow.release = () => {
    if (this.previousNumShapes != this.currentNumShapes) {
      this.numCorrect++;
      this.consecutiveCorrect++;
      this.correctAudio.play();
      this._addScore();

      // resets the reducing points if user score more than 5 consecutive correct
      if (this.consecutiveCorrect >= 5) {
        this.wrongAnswerNoConsecutiveCorrect = 0;
      }
    } else {
      // attempt to reduce score if user get wrong answer more than NUM_WRONG_BEFORE_REDUCING_SCORE without getting 3 consecutive corrects.
      // If the user obtained a wrong answer without getting at least 3 correct answers
      // consecutively for more than 3 times, then the user would lose 100 points for every wrong answer.
      // This will get reset when the user obtained at 5 correct answers consecutively.
      if (this.consecutiveCorrect <= this.NUM_WRONG_BEFORE_REDUCING_SCORE) {
        this.wrongAnswerNoConsecutiveCorrect++;
        if (
          this.wrongAnswerNoConsecutiveCorrect >
          this.NUM_WRONG_BEFORE_REDUCING_SCORE
        ) {
          this.score -= 100;
        }
      }

      this.consecutiveCorrect = 0;
      this.incorrectAudio.play();
    }

    this._createNextShapes();
  };

  this.rightArrow.release = () => {
    if (this.previousNumShapes == this.currentNumShapes) {
      this.numCorrect++;
      this.consecutiveCorrect++;
      this.correctAudio.play();
      this._addScore();

      // resets the reducing points if user score more than 5 consecutive correct
      if (this.consecutiveCorrect >= 5) {
        this.wrongAnswerNoConsecutiveCorrect = 0;
      }
    } else {
      // attempt to reduce score if user get wrong answer more than NUM_WRONG_BEFORE_REDUCING_SCORE without getting 3 consecutive corrects.
      // If the user obtained a wrong answer without getting at least 3 correct answers
      // consecutively for more than 3 times, then the user would lose 100 points for every wrong answer.
      // This will get reset when the user obtained at 5 correct answers consecutively.
      if (this.consecutiveCorrect <= this.NUM_WRONG_BEFORE_REDUCING_SCORE) {
        this.wrongAnswerNoConsecutiveCorrect++;
        if (
          this.wrongAnswerNoConsecutiveCorrect >
          this.NUM_WRONG_BEFORE_REDUCING_SCORE
        ) {
          this.score -= 100;
        }
      }

      this.consecutiveCorrect = 0;
      this.incorrectAudio.play();
    }

    this._createNextShapes();
  };
};

CardSwap.prototype._createShapesBg = function () {
  const shapesBackground = new PIXI.Sprite.fromImage(
    'resources/bg/white_bg.jpg'
  );
  shapesBackground.position.x = this.shapesBackgroundX;
  shapesBackground.position.y = this.shapesBackgroundY;
  shapesBackground.anchor.set(0.5);
  shapesBackground.width = this.shapesBackgroundWidth;
  shapesBackground.height = this.shapesBackgroundWidth;
  this.addChild(shapesBackground);
};

// shapeValue can be 'triangle', 'square', 'circle', 'rectangle'
CardSwap.prototype._createShape = function (
  shapeValue,
  x,
  y,
  width,
  height,
  color
) {
  const shapeFunc = {
    square: () => {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(2, 0x000000, 1);
      graphics.beginFill(color);
      graphics.drawRect(x, y, width, height);
      return graphics;
    },
    circle: () => {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(2, 0x000000, 1);
      graphics.beginFill(color);
      graphics.drawCircle(x + width, y + height, width, height);
      return graphics;
    },
    triangle: () => {
      const graphics = this._createTriangle(x, y, width, color);
      return graphics;
    },
  };

  const shapeCreated = shapeFunc[shapeValue]();
  return shapeCreated;
};

CardSwap.prototype._createNextShapes = function () {
  this.previousNumShapes = this.currentDrawnShapes.length;
  for (const currentDrawnShape of this.currentDrawnShapes) {
    this.removeChild(currentDrawnShape);
  }
  this.currentDrawnShapes = [];

  this.currentNumShapes = this.NUM_CHOICES_SHAPES[
    Math.floor(Math.random() * this.NUM_CHOICES_SHAPES.length)
  ];

  const currentColorIndex = Math.floor(Math.random() * this.COLORS.length);
  const color = this.COLORS[currentColorIndex];
  let createdShapes = [];

  for (var i = 0; i < this.currentNumShapes; i++) {
    const shapeSize = Math.max(
      this.SHAPES_MIN_SIZE,
      Math.floor(Math.random() * this.SHAPES_MAX_SIZE)
    );
    const shapeValue = this.AVAILABLE_SHAPES[
      Math.floor(Math.random() * this.AVAILABLE_SHAPES.length)
    ];
    let isIntersect = false; // variable to check if it intersects with created shapes

    // create while loop to re-add shapes in case it intersect with other shapes.
    let loopIteration = 0; // check how many times have looped, if more than 10 just create the shape.
    while (true) {
      const x =
        this.shapesBackgroundX -
        this.shapesBackgroundWidth / 2 +
        Math.floor(
          Math.random() * (this.shapesBackgroundWidth - shapeSize * 2)
        );
      const y =
        this.shapesBackgroundY -
        this.shapesBackgroundHeight / 2 +
        Math.floor(
          Math.random() * (this.shapesBackgroundHeight - shapeSize * 2)
        );

      const currentShape = this._createShape(
        shapeValue,
        x,
        y,
        shapeSize,
        shapeSize,
        color
      );

      // make sure the created shapes do not intersect each other
      for (const createdShape of createdShapes) {
        if (this._checkIntersection(createdShape, currentShape)) {
          isIntersect = true;
          break;
        }
      } // end for
      if (!isIntersect) {
        this.currentDrawnShapes.push(currentShape);
        this.addChild(currentShape);
        createdShapes.push(currentShape);
        break;
      }
      loopIteration++;

      // if have loop too much, just create the shape
      if (loopIteration > 10) {
        this.currentDrawnShapes.push(currentShape);
        this.addChild(currentShape);
        createdShapes.push(currentShape);
        break;
      }
    } // end while
  }
};

CardSwap.prototype._createTriangle = function (xPos, yPos, width, color) {
  var triangle = new PIXI.Graphics();

  triangle.x = xPos;
  triangle.y = yPos;

  var triangleWidth = width,
    triangleHeight = triangleWidth,
    triangleHalfway = triangleWidth / 2;

  // draw triangle
  triangle.beginFill(color, 1);
  triangle.lineStyle(2, 0x000000, 1);
  triangle.moveTo(triangleWidth, 0);
  triangle.lineTo(triangleHalfway, triangleHeight);
  triangle.lineTo(0, 0);
  triangle.lineTo(triangleHalfway, 0);
  triangle.lineTo(triangleWidth, 0);
  triangle.endFill();

  return triangle;
};

CardSwap.prototype.startGame = function () {
  this._createKeyboardInput();
  this._createNextShapes();
  this._createTimeTicking(this.endSpeedyGame.bind(this));
};

CardSwap.prototype._initialize = function () {
  this._createBackground();
  this._createShapesBg();
  this._createNextShapes();
  this._createScoreText();
  this._createStartingCountdown(this.startGame.bind(this));
};
