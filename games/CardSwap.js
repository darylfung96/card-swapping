function CardSwap(screenWidth, screenHeight) {
  GameContainer.call(this, screenWidth, screenHeight);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  // set the audio
  this.correctAudio = new Audio('resources/audio/correct.mp3');
  this.incorrectAudio = new Audio('resources/audio/incorrect.mp3');

  this.isFlipping = false; // is the card still getting flipped?

  this.numCardsToSwapNow = 0; // the number card to swap in one go
  this.cardsDoneSwapping = 0; // is all the cards done swapping? Check before swapping more cards after. This number
  // should be maximum the number of cards to swap at once
  this.isAllSwappingDone = false;

  // TODO: change this
  const difficulty = 2;
  const seed = 1;
  Math.seedrandom(seed);

  this._createCards(difficulty); // pass in difficulty
  this._initialize();
}
CardSwap.prototype = Object.create(GameContainer.prototype);

CardSwap.prototype._createCards = function (difficulty) {
  this.cardGroup = ['cardHearts', 'cardSpades', 'cardDiamonds', 'cardClubs'];
  this.cardNumbers = ['9', '10', 'A', 'J', 'K', 'Q'];
  this.allCardNames = [];
  this.rotateAllCard = 0; // is there a chance that when swapping we rotate all card by this amount to left/right (1 means move by 1, 2 means move by 2)
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

  // edit the difficulty
  this.MIN_CARD_TO_SWAP = 2;
  switch (difficulty) {
    case 1:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 2;
      break;
    case 2:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 4;
      break;
    case 3:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 4;
      this.rotateAllCard = 1;
      break;
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

CardSwap.prototype._swapOnce = function () {
  const numCardsToSwap =
    Math.floor(
      Math.random() * (this.MAX_CARD_TO_SWAP - this.MIN_CARD_TO_SWAP + 1)
    ) + this.MIN_CARD_TO_SWAP;
  let selectedCardsIndex = []; // keep track of which cards are selected so we choose unique cards to swap
  let selectedCards = [];
  // select cards to swap
  let numSelectedSwapCards = 0;
  while (numSelectedSwapCards < numCardsToSwap) {
    const currentSelectedIndex = Math.floor(
      Math.random() * this.allSwapCards.length
    );
    if (selectedCardsIndex.indexOf(currentSelectedIndex) !== -1) continue; // don't add same cards

    selectedCards.push(this.allSwapCards[currentSelectedIndex]);
    selectedCardsIndex.push(currentSelectedIndex);
    numSelectedSwapCards++;
  }

  // start swapping cards
  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  const shuffledIndex = shuffle(Array.from(Array(selectedCards.length).keys())); // shuffle the selected card index, so we prepare to swap the card
  let selectedCardsLocation = []; // keep track of the selected cards location then we swap the cards
  for (const index of shuffledIndex) {
    selectedCardsLocation.push([
      selectedCards[index].x,
      selectedCards[index].y,
    ]);
  }
  // swap the card location
  this.numCardsToSwapNow = selectedCardsLocation.length;
  this.cardsDoneSwapping = 0;
  for (let i = 0; i < selectedCardsLocation.length; i++) {
    selectedCards[i].swapPosition(selectedCardsLocation[i], this);
  }
};
CardSwap.prototype._startSwapping = function () {
  console.log('start swapping');
  this.isAllSwappingDone = false;

  // swap only for 20 seconds
  // set the all swapping done boolean to true
  const setAllSwappingDone = function () {
    this.isAllSwappingDone = true;
  };
  this._createCountdown(20, setAllSwappingDone.bind(this));
  this._swapOnce();

  // poll to make sure swapping is complete before calling more swapping cards
  const self = this;
  const pollSwapping = setInterval(() => {
    if (self.cardsDoneSwapping === self.numCardsToSwapNow) self._swapOnce();
    if (self.isAllSwappingDone) clearInterval(pollSwapping);
  }, 100);
};

CardSwap.prototype._flipSwapCards = function () {
  this.isFlipping = true;
  for (const currentSwapCard of this.allSwapCards) {
    currentSwapCard.flipCard(this); // this will set isFlipping to false when it is done flipping
  }

  // poll and check if the flipping card is done then we call _startSwapping
  const self = this;
  const checkIfFlipping = setInterval(() => {
    if (!self.isFlipping) {
      clearInterval(checkIfFlipping);
      self._startSwapping();
    }
  }, 1000);
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

  targetCardMouseUp = function (screenWidth) {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.mouseData = null;

    // if card not in side panel then we move back to its last location
    if (this.x < screenWidth * 0.8 + this.width * 0.5) {
      this.setLocation(this.lastXposition, this.lastYposition);
    }
  };

  targetCardMouseMove = function (cardSwapContainer) {
    if (this.dragging) {
      var newPosition = this.mouseData.getLocalPosition(this.parent);

      // prevent the target card from going into the game area
      if (!cardSwapContainer.isAllSwappingDone) {
        newPosition.x = Math.max(
          cardSwapContainer.screenWidth * 0.8 + this.width * 0.5,
          newPosition.x
        );
      }

      newPosition.y = Math.max(
        cardSwapContainer.screenHeight * 0.1 + this.height * 0.5,
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
        .on('mouseup', targetCardMouseUp.bind(targetCard, this.screenWidth))
        .on(
          'mouseupoutside',
          targetCardMouseUp.bind(targetCard, this.screenWidth)
        )
        .on('touchend', targetCardMouseUp.bind(targetCard, this.screenWidth))
        .on(
          'touchendoutside',
          targetCardMouseUp.bind(targetCard, this.screenWidth)
        )
        // mouse move
        .on('mousemove', targetCardMouseMove.bind(targetCard, this))
        .on('touchmove', targetCardMouseMove.bind(targetCard, this));
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
