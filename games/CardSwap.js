function CardSwap(screenWidth, screenHeight) {
  GameContainer.call(this, screenWidth, screenHeight);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  // set the audio
  this.correctAudio = new Audio('resources/audio/correct.mp3');
  this.incorrectAudio = new Audio('resources/audio/incorrect.mp3');

  // has the guessing started? for the mouse movement of the target cards too
  // preventing the targets card from going into game area during and before swapping of the cards
  this.isGuessing = false;

  this._createCards(1); // pass in difficulty
  this._initialize();
}
CardSwap.prototype = Object.create(GameContainer.prototype);

CardSwap.prototype._createCards = function (difficulty) {
  this.cardGroup = ['cardHearts', 'cardSpades', 'cardDiamonds', 'cardClubs'];
  this.cardNumbers = ['9', '10', 'A', 'J', 'K', 'Q'];
  this.allCardNames = [];
  for (const currentCardGroup of this.cardGroup) {
    for (const currentCardNumber of this.cardNumbers) {
      this.allCardNames.push(`${currentCardGroup}${currentCardNumber}`);
    }
  }

  this.fiveCardPositions = [
    [this.screenWidth * 0.45, this.screenHeight * 0.22],
    [this.screenWidth * 0.22, this.screenHeight * 0.37],
    [this.screenWidth * 0.67, this.screenHeight * 0.37],
    [this.screenWidth * 0.37, this.screenHeight * 0.57],
    [this.screenWidth * 0.52, this.screenHeight * 0.57],
  ];

  this.eightCardPositions = [
    [this.screenWidth * 0.35, this.screenHeight * 0.22],
    [this.screenWidth * 0.55, this.screenHeight * 0.22],
    [this.screenWidth * 0.15, this.screenHeight * 0.37],
    [this.screenWidth * 0.72, this.screenHeight * 0.37],
    [this.screenWidth * 0.15, this.screenHeight * 0.57],
    [this.screenWidth * 0.72, this.screenHeight * 0.57],
    [this.screenWidth * 0.35, this.screenHeight * 0.72],
    [this.screenWidth * 0.55, this.screenHeight * 0.72],
  ];

  this.nineCardPositions = [
    [this.screenWidth * 0.35, this.screenHeight * 0.22],
    [this.screenWidth * 0.55, this.screenHeight * 0.22],
    [this.screenWidth * 0.15, this.screenHeight * 0.37],
    [this.screenWidth * 0.72, this.screenHeight * 0.37],
    [this.screenWidth * 0.15, this.screenHeight * 0.57],
    [this.screenWidth * 0.72, this.screenHeight * 0.57],
    [this.screenWidth * 0.35, this.screenHeight * 0.72],
    [this.screenWidth * 0.55, this.screenHeight * 0.72],
    [this.screenWidth * 0.45, this.screenHeight * 0.45],
  ];

  if (difficulty <= 3) {
    this.numTargetCards = 2;
    this.numSwapCards = 5;
  }

  const cardPositionsKey = {
    5: this.fiveCardPositions,
    8: this.eightCardPositions,
    9: this.nineCardPositions,
  };
  this.cardPositions = cardPositionsKey[this.numSwapCards];
};

CardSwap.prototype.endSpeedyGame = function () {
  if (this.startCountdown) {
    clearInterval(this.startCountdown);
  }

  this._drawEndMenu();
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

CardSwap.prototype._startSwapping = function () {};

CardSwap.prototype._flipSwapCards = function () {
  for (const currentSwapCard of this.allSwapCards) {
    currentSwapCard.flipCard();
  }
};
/********************** Initialization ***********************/
CardSwap.prototype._createBackground = function () {
  // create background
  var bg = new PIXI.Sprite.fromImage('resources/bg/wooden.jpeg');
  bg.alpha = 1;
  bg.width = this.screenWidth;
  bg.height = this.screenHeight;
  this.addChild(bg);

  // create top panel
  var topPanel = new PIXI.Sprite.fromImage('resources/bg/red_bg.png');
  topPanel.alpha = 1;
  topPanel.width = this.screenWidth;
  topPanel.height = this.screenHeight * 0.1;

  this.addChild(topPanel);

  // create side panel
  var sidePanel = new PIXI.Sprite.fromImage('resources/bg/orange_bg.png');
  sidePanel.alpha = 1;
  sidePanel.width = this.screenWidth * 0.2;
  sidePanel.height = this.screenHeight;
  sidePanel.x = this.screenWidth * 0.8;
  sidePanel.y = this.screenHeight * 0.1;

  this.addChild(sidePanel);
};
CardSwap.prototype._createSwapCards = function () {
  // create cards
  for (let i = 0; i < this.numSwapCards; i++) {
    // choose random card
    const cardName = this.allCardNames[
      Math.floor(Math.random() * this.allCardNames.length)
    ];
    this.allCardNames.splice(this.allCardNames.indexOf(cardName), 1); // remove card, must be unique on the table

    // generate card sprite
    this.cardSprite = new Card(`resources/Cards/${cardName}.png`);
    this.cardSprite.scale.set(0.6);
    this.cardSprite.x = this.cardPositions[i][0];
    this.cardSprite.y = this.cardPositions[i][1];
    this.cardSprite.anchor.set(0.5);
    this.addChild(this.cardSprite);

    // keep track of the swap cards
    this.allSwapCards.push(this.cardSprite);
  }
};
CardSwap.prototype._generateTargetCards = function () {
  // randomly select the swap card as target card
  let totalTargets = 0;
  while (totalTargets < this.numTargetCards) {
    const currentIndex = Math.floor(Math.random() * this.allSwapCards.length);
    if (!this.allSwapCards[currentIndex].isTarget) {
      this.allSwapCards[currentIndex].isTarget = true;
      totalTargets++;
    }
  }
};
CardSwap.prototype._createTargetCards = function () {
  // add the target cards to the side panel
  targetCardMouseDown = function (event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.mouseData = event.data;
    this.dragging = true;
    this.setLastLocation(this.x, this.y);
  };

  targetCardMouseUp = function () {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.mouseData = null;
  };

  targetCardMouseMove = function (screenWidth, screenHeight, isGuessing) {
    if (this.dragging) {
      var newPosition = this.mouseData.getLocalPosition(this.parent);

      // prevent the target card from going into the game area
      if (!isGuessing) {
        newPosition.x = Math.max(
          screenWidth * 0.8 + this.width * 0.5,
          newPosition.x
        );
      }

      newPosition.y = Math.max(
        screenHeight * 0.1 + this.height * 0.5,
        newPosition.y
      );

      this.setLocation(newPosition.x, newPosition.y);
    }
  };
  let targetX = this.screenWidth * 0.84;
  let targetY = this.screenHeight * 0.17;
  const CARDS_PER_ROW = 2;
  let currentTargetCardIndex = 0;
  for (const swapCard of this.allSwapCards) {
    if (swapCard.isTarget) {
      const targetCard = new TargetCard(swapCard.imageLocation);
      //mouse down
      targetCard
        .on('mousedown', targetCardMouseDown)
        .on('touchstart', targetCardMouseDown)
        // mouse up
        .on('mouseup', targetCardMouseUp)
        .on('mouseupoutside', targetCardMouseUp)
        .on('touchend', targetCardMouseUp)
        .on('touchendoutside', targetCardMouseUp)
        // mouse move
        .on(
          'mousemove',
          targetCardMouseMove.bind(
            targetCard,
            this.screenWidth,
            this.screenHeight,
            this.isGuessing
          )
        )
        .on(
          'touchmove',
          targetCardMouseMove.bind(
            targetCard,
            this.screenWidth,
            this.screenHeight,
            this.isGuessing
          )
        );
      console.log(targetCard);
      targetCard.scale.set(0.35);
      targetCard.anchor.set(0.5);
      targetCard.interactive = true;
      targetCard.buttonMode = true;
      targetCard.setLocation(
        targetX + (currentTargetCardIndex % 2) * (this.screenWidth * 0.1),
        targetY +
          Math.floor(currentTargetCardIndex / 2) * (this.screenHeight * 0.1)
      );
      this.allTargetCards.push(targetCard);
      this.addChild(targetCard);
      currentTargetCardIndex++;
    }
  }
};
CardSwap.prototype._initializeCards = function () {
  this.allSwapCards = [];
  this.allTargetCards = [];

  this._createSwapCards();
  this._generateTargetCards();
  this._createTargetCards();
};
CardSwap.prototype._initialize = function () {
  this._createBackground();
  this._createScoreText();
  this._initializeCards();
  this._createCountdown(1, this._flipSwapCards.bind(this));
};
