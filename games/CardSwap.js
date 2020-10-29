/**
 * CardSwap game container runs the CardSwap game
 *
 * @param {int} screenWidth - the width of the game screen
 * @param {int} screenHeight - the height of the game screen
 * @param {int} difficulty - the difficulty of the game
 * @param {string} seed - the seed provided to randomize the card swapping
 * @param {string} npcLevel - the level of NPC (hard, medium, easy), otherwise it should be null
 * @param {object} userInfo - the information of the current user
 * @param {object} challengeInformation - The challenge information if applicable {type: 'send'or'receive', challengedPlayer: 'challengedPlayerId', 'normalizedScoreToBeat?': 1}
 * @param {function} startGameCallback - the function callback to restart the game
 * @param {function} returnMenuCallback - the function callback to quit the game and return to menu
 */
function CardSwap(
  screenWidth,
  screenHeight,
  difficulty,
  seed,
  npcLevel,
  userInfo,
  challengeInformation,
  startGameCallback,
  returnMenuCallback
) {
  GameContainer.call(this, screenWidth, screenHeight);

  this.self = this; // return the rendering container, for this class it is "this"
  this.userInfo = userInfo;
  this.startGameCallback = startGameCallback;
  this.returnMenuCallback = returnMenuCallback;
  this.challengeInformation = challengeInformation;

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.isFlipping = false; // is the card still getting flipped?

  this.numCardsToSwapNow = 0; // the number card to swap in one go
  this.cardsDoneSwapping = 0; // is all the cards done swapping? Check before swapping more cards after. This number
  // should be maximum the number of cards to swap at once
  // also this.cardsDoneSwapping is manipulated in the Card.js
  this.isAllSwappingDone = false;
  this.isGuessing = false;
  this.isGameEnd = false;
  this.modalVisible = false;

  // this is the guessed target card that are mapped to the swap card
  // {targetCard: [swapCard, score]}
  this.guessedTargetCards = {};
  // this is for placeholder when a card is placed into the area for guessing
  // when user does not interact and time runs out, we can remove the card and place back into side panel
  this.targetCardforSelection = null;

  this.rotateAllCard = 0; // is there a chance that all swap cards rotate to left/right? on difficulty 3 this is enabled
  this.difficulty = difficulty;
  this.levelText = false;
  this.seed = seed;
  this.npcLevel = npcLevel;
  this.NPCScore = null;

  this.SWAPPING_SECONDS = 20;
  Math.seedrandom(seed);
  this._initializeSettings(difficulty); // pass in difficulty
  this._generateNPCScore(npcLevel);
  this._initialize();
}
CardSwap.prototype = Object.create(GameContainer.prototype);

/**
 * _generateNPCScore generates the NPC scores
 *
 * @param {string} npcLevel - the npc difficulty (hard, medium, easy)
 */
CardSwap.prototype._generateNPCScore = function (npcLevel) {
  if (npcLevel === null) return;

  const generateNPCScore = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  this.NPCScore = 0;

  const NPCDiffiToScores = {
    hard: () => {
      return generateNPCScore(2, 3);
    },
    medium: () => {
      return generateNPCScore(1, 3);
    },
    easy: () => {
      return generateNPCScore(1, 2);
    },
  };

  for (let i = 0; i < this.numTargetCards; i++) {
    this.NPCScore += NPCDiffiToScores[npcLevel]();
  }
};

/**
 * _initializeSettings receives the difficulty and creates the settings for the game appropriately
 *
 * @param {int} difficulty - the difficulty of the game
 */
CardSwap.prototype._initializeSettings = function (difficulty) {
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
    [this.screenWidth * 0.67, this.screenHeight * 0.37],
    [this.screenWidth * 0.57, this.screenHeight * 0.57],
    [this.screenWidth * 0.32, this.screenHeight * 0.57],
    [this.screenWidth * 0.22, this.screenHeight * 0.37],
  ];

  this.eightCardPositions = [
    [this.screenWidth * 0.35, this.screenHeight * 0.22],
    [this.screenWidth * 0.55, this.screenHeight * 0.22],
    [this.screenWidth * 0.72, this.screenHeight * 0.37],
    [this.screenWidth * 0.72, this.screenHeight * 0.57],
    [this.screenWidth * 0.55, this.screenHeight * 0.72],
    [this.screenWidth * 0.35, this.screenHeight * 0.72],
    [this.screenWidth * 0.15, this.screenHeight * 0.57],
    [this.screenWidth * 0.15, this.screenHeight * 0.37],
  ];

  this.nineCardPositions = [
    [this.screenWidth * 0.35, this.screenHeight * 0.22],
    [this.screenWidth * 0.55, this.screenHeight * 0.22],
    [this.screenWidth * 0.72, this.screenHeight * 0.37],
    [this.screenWidth * 0.72, this.screenHeight * 0.57],
    [this.screenWidth * 0.55, this.screenHeight * 0.72],
    [this.screenWidth * 0.35, this.screenHeight * 0.72],
    [this.screenWidth * 0.15, this.screenHeight * 0.57],
    [this.screenWidth * 0.15, this.screenHeight * 0.37],
    [this.screenWidth * 0.45, this.screenHeight * 0.45],
  ];

  // edit the difficulty
  this.MIN_CARD_TO_SWAP = 2;
  switch (difficulty) {
    case 1:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 2;
      this.totalSwap = 10;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 2:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 4;
      this.totalSwap = 10;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 3:
      this.numTargetCards = 2;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 4;
      this.totalSwap = 10;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      this.rotateAllCard = 1;
      break;
    case 4:
      this.numTargetCards = 3;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 3;
      this.totalSwap = 12;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 5:
      this.numTargetCards = 3;
      this.numSwapCards = 5;
      this.MAX_CARD_TO_SWAP = 4;
      this.totalSwap = 12;
      this.rotateAllCard = 1;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 6:
      this.numTargetCards = 4;
      this.numSwapCards = 8;
      this.MAX_CARD_TO_SWAP = 4;
      this.totalSwap = 12;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 7:
      this.numTargetCards = 4;
      this.numSwapCards = 8;
      this.MAX_CARD_TO_SWAP = 6;
      this.totalSwap = 14;
      this.rotateAllCard = 1;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 8:
      this.numTargetCards = 6;
      this.numSwapCards = 8;
      this.MAX_CARD_TO_SWAP = 4;
      this.totalSwap = 14;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 9:
      this.numTargetCards = 6;
      this.numSwapCards = 8;
      this.MAX_CARD_TO_SWAP = 6;
      this.totalSwap = 14;
      this.rotateAllCard = 2;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
    case 10:
      this.numTargetCards = 7;
      this.numSwapCards = 9;
      this.MAX_CARD_TO_SWAP = 6;
      this.totalSwap = 14;
      this.rotateAllCard = 2;
      this.seconds_per_swap = (this.SWAPPING_SECONDS / this.totalSwap) * 1000;
      break;
  }

  const cardPositionsKey = {
    5: this.fiveCardPositions,
    8: this.eightCardPositions,
    9: this.nineCardPositions,
  };
  this.cardPositions = cardPositionsKey[this.numSwapCards];
};

/**
 * _swapAll rotates all the swap cards to left/right by the numberOfTimes
 *
 * @param {int} numberOfTimes - the number of times to rotate all the swap cards to left/right
 */
CardSwap.prototype._swapAll = function (numberOfTimes) {
  // we will swap the amount of times numberOfTimes is called
  // for instance if numberOfTimes is 2, there are 3 swap cards
  // then cardsDoneSwapping will be -3.
  // this is because we need to swap 6 times (3 * 2).
  // since we have a check that checks until this.cardsDoneSwapping equals to the length of allSwapCards
  // before swapping more cards
  this.cardsDoneSwapping =
    -Math.max(0, numberOfTimes - 1) * this.allSwapCards.length;
  // how many cards to be done swapping before we do swapAll again of numberOfTimes > 1
  let nextBatchDoneSwapping = this.cardsDoneSwapping; // we will add this.allSwapCards.length to this variable in the loop
  // direction = 1 to the right
  // direction = -1 to the left
  const getAllNextSwapPositions = function (rightDirection) {
    // calculate all the swap cards next position
    const lastSwapCard = this.allSwapCards[this.allSwapCards.length - 1];
    let nextAllSwapCardPositions = [];
    let indexOfNextAllSwapCardPositions = [];
    // rotate swap all to the left
    if (!rightDirection) {
      nextAllSwapCardPositions.push([lastSwapCard.x, lastSwapCard.y]);
      indexOfNextAllSwapCardPositions.push(this.allSwapCards.length - 1);
      for (let i = 0; i < this.allSwapCards.length - 1; i++) {
        nextAllSwapCardPositions.push([
          this.allSwapCards[i].x,
          this.allSwapCards[i].y,
        ]);
        indexOfNextAllSwapCardPositions.push(i);
      }
      // rotate swap all to the right
    } else {
      for (let i = 1; i < this.allSwapCards.length; i++) {
        nextAllSwapCardPositions.push([
          this.allSwapCards[i].x,
          this.allSwapCards[i].y,
        ]);
        indexOfNextAllSwapCardPositions.push(i);
      }
      nextAllSwapCardPositions.push([
        this.allSwapCards[0].x,
        this.allSwapCards[0].y,
      ]);
      indexOfNextAllSwapCardPositions.push(0);
    }
    return [nextAllSwapCardPositions, indexOfNextAllSwapCardPositions];
  };

  // swap the this.allSwapCard index position because swapAll function uses the index of the swap card in its position in this.allSwapCards
  const swapIndexOfSwapCardPositions = function (
    cardSwapContainer,
    indexOfNextAllSwapCardPositions
  ) {
    let temp = [];
    for (let i = 0; i < indexOfNextAllSwapCardPositions.length; i++) {
      temp.push(
        cardSwapContainer.allSwapCards[indexOfNextAllSwapCardPositions[i]]
      );
    }
    cardSwapContainer.allSwapCards = temp;
  };
  const self = this;
  // start swapping all the swap cards
  const swapAllInterval = setInterval(() => {
    if (this.cardsDoneSwapping < nextBatchDoneSwapping) return;

    nextBatchDoneSwapping += self.allSwapCards.length;
    const rightDirection = Math.random() >= 0.5; // swap all left or swap all right
    const [
      nextAllSwapCardPositions,
      indexOfNextAllSwapCardPositions,
    ] = getAllNextSwapPositions.bind(self, rightDirection)();
    // swap the cards
    for (let i = 0; i < self.allSwapCards.length; i++) {
      self.allSwapCards[i].swapPosition(nextAllSwapCardPositions[i], self);
    }
    swapIndexOfSwapCardPositions(self, indexOfNextAllSwapCardPositions);
    // if it is the last time swapping all cards, then we can remove the interval
    if (self.cardsDoneSwapping >= 0) {
      clearInterval(swapAllInterval);
    }
  }, 100);
};

/**
 * _swapOnce swap once either swapping all swap cards to left/right or selecting some cards to be swapped
 *
 */
CardSwap.prototype._swapOnce = function () {
  // rotate all cards
  if (Math.random() > 0.8 && this.rotateAllCard > 0) {
    this.numCardsToSwapNow = this.allSwapCards.length;

    // how many times to rotate all cardsleft/right
    let numberOfTimestoRotate = 1;
    if (this.rotateAllCard > 1) {
      if (Math.random() > 0.5) numberOfTimestoRotate = 2;
    }
    this._swapAll(numberOfTimestoRotate);
    return;
  }

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

  // move the index of the selected swap cards
  function moveElementsInArray(a) {
    const b = [...a];
    const first = b.shift();
    b.push(first);
    return b;
  }

  // Array.from(Array(selectedCards.length).keys()) create [0, 1, 2, 3, ...]
  const shuffledIndex = moveElementsInArray(
    Array.from(Array(selectedCards.length).keys())
  ); // move the selected card index, so we prepare to swap the card
  let selectedCardsLocation = []; // keep track of the selected cards location then we swap the cards
  for (let index = 0; index < selectedCardsIndex.length; index++) {
    const currentPosition = selectedCardsIndex[index];
    const nextPosition = shuffledIndex[index];
    selectedCardsLocation.push([
      selectedCards[nextPosition].x,
      selectedCards[nextPosition].y,
    ]);
    // change the position in the this.allSwapCards since our swapAll(Rotate all to next slot) utilizes the index of this.allSwapCards
    this.allSwapCards[selectedCardsIndex[nextPosition]] = selectedCards[index];
  }
  // swap the card location
  this.numCardsToSwapNow = selectedCardsLocation.length;
  this.cardsDoneSwapping = 0;
  for (let i = 0; i < selectedCardsLocation.length; i++) {
    selectedCards[i].swapPosition(selectedCardsLocation[i], this);
  }
};

/**
 * _startSwapping starts swapping of the swap cards in the game area for 20 seconds
 *
 */
CardSwap.prototype._startSwapping = function () {
  this.isAllSwappingDone = false;

  // swap only for 20 seconds
  // set the all swapping done boolean to true
  const setAllSwappingDone = function () {
    this.isAllSwappingDone = true;
    this.isGuessing = true;
    // start timer for guessing
    this._createCountdown(20, this._calculateScore.bind(this));
  };
  // stop swapping after 20 seconds
  this._createCountdown(20, setAllSwappingDone.bind(this));

  // poll to make sure swapping is complete before calling more swapping cards
  const self = this;
  const pollSwapping = setInterval(() => {
    // if not done swapping yet
    if (self.cardsDoneSwapping === self.numCardsToSwapNow) {
      if (!self.isAllSwappingDone) self._swapOnce();
      // if done swapping
      else {
        clearInterval(pollSwapping);
        // show the guessing icon for each swap card
        for (const swapCard of self.allSwapCards) {
          swapCard.showGuessing(this);
        }

        // move the target card up to the front
        for (const currentTargetCard of this.allTargetCards) {
          this.removeChild(currentTargetCard);
          this.addChild(currentTargetCard);
        }
      }
    }
  }, this.seconds_per_swap);
};

/**
 * _flipSwapCards flip the swap cards to close the swap cards when swapping is starting
 * _flipSwapCards also flips the swap cards back up when the time to guess has ended
 *
 */
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

/**
 * _drawModalConfident shows the modal that lets the user select if they are confident in their decision of the target card
 * in the swap card location
 *
 * @param {Card} - The swap Card selected to guess as matching the target card
 * @param {TargetCard} - The target card chosen to guess as the swap card
 */
CardSwap.prototype._drawModalConfident = function (
  guessedSwapCard,
  guessedTargetCard
) {
  this.modalVisible = true;
  this.modalBackground = PIXI.Sprite.fromImage('resources/bg/blue_bg.png');
  this.modalBackground.x = this.screenWidth * 0.5;
  this.modalBackground.y = this.screenHeight * 0.5;
  this.modalBackground.width = this.screenWidth * 0.8;
  this.modalBackground.height = this.screenHeight * 0.5;
  this.modalBackground.anchor.set(0.5);

  this.modalText = new PIXI.Text(
    'How confident are you that the card is here?',
    { fill: '#fff', fontSize: 20 }
  );
  this.modalText.x = this.screenWidth * 0.5;
  this.modalText.y = this.screenHeight * 0.3;
  this.modalText.anchor.set(0.5);

  // store the target card guessed with the swap card
  const guessCardScore = function (self, score) {
    if (guessedTargetCard.scoreSprite)
      self.removeChild(guessedTargetCard.scoreSprite);
    guessedTargetCard.setGuessScore(score);
    self.addChild(guessedTargetCard.scoreSprite);
    self.guessedTargetCards[guessedTargetCard.imageLocation] = [
      guessedTargetCard,
      guessedSwapCard,
      score,
    ];
    guessedTargetCard.setLastLocation(guessedTargetCard.x, guessedTargetCard.y);
    self.targetCardforSelection = null;
    self._removeModalConfident();
  };

  this.notConfidentText = PIXI.Sprite.fromImage(
    'resources/buttons/button_not-confident.png'
  );
  this.notConfidentText.x = this.screenWidth * 0.25;
  this.notConfidentText.y = this.screenHeight * 0.5;
  this.notConfidentText.width = this.screenWidth * 0.22;
  this.notConfidentText.height = this.screenHeight * 0.08;
  this.notConfidentText.anchor.set(0.5);
  this.notConfidentText.interactive = true;
  this.notConfidentText.buttonMode = true;
  this.notConfidentText
    .on('mouseup', guessCardScore.bind(this.notConfidentText, this, 1))
    .on('touchend', guessCardScore.bind(this.notConfidentText, this, 1));

  this.somewhatConfidentText = PIXI.Sprite.fromImage(
    'resources/buttons/button_somewhat-confident.png'
  );
  this.somewhatConfidentText.x = this.screenWidth * 0.5;
  this.somewhatConfidentText.y = this.screenHeight * 0.5;
  this.somewhatConfidentText.width = this.screenWidth * 0.22;
  this.somewhatConfidentText.height = this.screenHeight * 0.08;
  this.somewhatConfidentText.anchor.set(0.5);
  this.somewhatConfidentText.interactive = true;
  this.somewhatConfidentText.buttonMode = true;
  this.somewhatConfidentText
    .on('mouseup', guessCardScore.bind(this.somewhatConfidentText, this, 2))
    .on('touchend', guessCardScore.bind(this.somewhatConfidentText, this, 2));

  this.veryConfidentText = PIXI.Sprite.fromImage(
    'resources/buttons/button_very-confident.png'
  );
  this.veryConfidentText.x = this.screenWidth * 0.75;
  this.veryConfidentText.y = this.screenHeight * 0.5;
  this.veryConfidentText.width = this.screenWidth * 0.22;
  this.veryConfidentText.height = this.screenHeight * 0.08;
  this.veryConfidentText.anchor.set(0.5);
  this.veryConfidentText.interactive = true;
  this.veryConfidentText.buttonMode = true;
  this.veryConfidentText
    .on('mouseup', guessCardScore.bind(this.veryConfidentText, this, 3))
    .on('touchend', guessCardScore.bind(this.veryConfidentText, this, 3));

  const cancelGuessingModal = function () {
    guessedTargetCard.setLocation(
      guessedTargetCard.lastXposition,
      guessedTargetCard.lastYposition
    );
    this._removeModalConfident();
  };
  this.cancelText = PIXI.Sprite.fromImage(
    'resources/buttons/button_cancel.png'
  );
  this.cancelText.x = this.screenWidth * 0.7;
  this.cancelText.y = this.screenHeight * 0.65;
  this.cancelText.width = this.screenWidth * 0.15;
  this.cancelText.height = this.screenHeight * 0.06;
  this.cancelText.interactive = true;
  this.cancelText.buttonMode = true;
  this.cancelText
    .on('mousedown', cancelGuessingModal.bind(this))
    .on('touchstart', cancelGuessingModal.bind(this));

  this.addChild(this.modalBackground);
  this.addChild(this.modalText);
  this.addChild(this.notConfidentText);
  this.addChild(this.somewhatConfidentText);
  this.addChild(this.veryConfidentText);
  this.addChild(this.cancelText);
};

/**
 * _removeModalConfident removes the modal that lets the user select if they are confident in their decision
 *
 */
CardSwap.prototype._removeModalConfident = function () {
  this.removeChild(this.modalBackground);
  this.removeChild(this.modalText);
  this.removeChild(this.notConfidentText);
  this.removeChild(this.somewhatConfidentText);
  this.removeChild(this.veryConfidentText);
  this.removeChild(this.cancelText);
  this.modalVisible = false;
};

// increase the score text to around the center of the screen
CardSwap.prototype._increaseScoreText = function (
  mostRecentScores,
  avgRecentScores,
  scoreThreshold
) {
  this.scoreText.anchor.set(0.5);
  const scoreTextTargetX = this.screenWidth * 0.4;
  const scoreTextTargetY = this.screenHeight * 0.3;
  const scoreTextTargetSize = 55;
  const deltaX = (scoreTextTargetX - this.scoreText.x) / 200;
  const deltaY = (scoreTextTargetY - this.scoreText.y) / 200;
  const deltaSize = (scoreTextTargetSize - 20) / 200;
  const increaseScoreTextInterval = setInterval(() => {
    this.scoreText.x += deltaX;
    this.scoreText.y += deltaY;
    this.scoreText.style.fontSize += deltaSize;
    this.scoreText.style.fontSize += deltaSize;
    if (
      scoreTextTargetX - this.scoreText.x < 3 &&
      scoreTextTargetY - this.scoreText.y < 3
    ) {
      // after finish increasing the score size
      clearInterval(increaseScoreTextInterval);
      for (const swapCard of this.allSwapCards) {
        this.removeChild(swapCard.guessingSprite);
        this.removeChild(swapCard);
      }
      for (const targetCard of this.allTargetCards) {
        this.removeChild(targetCard.scoreSprite);
        this.removeChild(targetCard);
      }

      // if this is not challenge, then we show unlock levels
      if (!this.challengeInformation) {
        if (this.userInfo.level <= this.difficulty + 1) {
          // congratulate and unlock level if user leveled up
          if (
            mostRecentScores.length > 4 &&
            avgRecentScores >= scoreThreshold
          ) {
            const unlockLevelText = new PIXI.Text(
              `You unlock level ${this.difficulty + 1}!`,
              { fill: '#fff', fontSize: 35 }
            );
            unlockLevelText.x = this.screenWidth * 0.4;
            unlockLevelText.y = this.screenHeight * 0.2;
            unlockLevelText.anchor.set(0.5);
            this.addChild(unlockLevelText);
          }
        }
      }

      // create NPC Score Text if exist
      if (this.NPCScore !== null) {
        const NPCScoreText = new PIXI.Text(`NPC Score: ${this.NPCScore}`, {
          fontSize: 55,
          fill: '#fff',
        });
        NPCScoreText.x = this.screenWidth * 0.4;
        NPCScoreText.y = this.screenHeight * 0.4;
        NPCScoreText.anchor.set(0.5);
        this.addChild(NPCScoreText);

        let resultText = '';
        if (this.score > this.NPCScore) {
          resultText = 'You win!';
        } else if (this.score < this.NPCScore) {
          resultText = 'You lose!';
        } else {
          resultText = "It's a tie!";
        }
        const winLoseText = new PIXI.Text(resultText, {
          fontSize: 55,
          fill: '#fff',
        });
        winLoseText.x = this.screenWidth * 0.4;
        winLoseText.y = this.screenHeight * 0.5;
        winLoseText.anchor.set(0.5);
        this.addChild(winLoseText);
      }

      // create play again text if not a challenge otherwise write challenge sent
      if (!this.challengeInformation) {
        this.playAgainText = ButtonFactoryText(
          this.screenWidth * 0.4,
          this.screenHeight * 0.6,
          'Play Again',
          { fill: '#fff', fontSize: 35 },
          () => {
            this.startGameCallback(
              this.userInfo.level,
              this.userInfo,
              null,
              this.npcLevel
            );
          }
        );
        this.addChild(this.playAgainText);
      } else {
        const createChallengeSentTextCallback = function (data) {
          if (!data.success) {
            console.error(
              'Something went wrong trying to send a challenge to the player'
            );
            return;
          }
          // if it is a challenge then we write challenge sent
          this.challengeSentText = ButtonFactoryText(
            this.screenWidth * 0.4,
            this.screenHeight * 0.6,
            `Challenge Sent to player ${this.challengeInformation.challengedPlayer}`,
            { fill: '#fff', fontSize: 35 }
          );
          this.addChild(this.challengeSentText);
        };
        // each target card is max 3 score. Since, there is negative we times 2
        const normalizedScore =
          (this.score + this.allTargetCards.length * 3) /
          (this.allTargetCards.length * 3 * 2);

        if (this.challengeInformation.type === 'send') {
          sendChallenge(
            null,
            this.seed,
            this.userInfo.id,
            this.challengeInformation.challengedPlayer,
            normalizedScore,
            'send',
            null,
            createChallengeSentTextCallback.bind(this)
          );
        } else {
          // if it is a challenge then we write challenge sent
          let result = null;
          if (
            normalizedScore >
            parseFloat(this.challengeInformation.normalizedScoreToBeat)
          ) {
            result = 'win';
          } else if (
            normalizedScore ===
            parseFloat(this.challengeInformation.normalizedScoreToBeat)
          ) {
            result = 'tie';
          } else if (
            normalizedScore <
            parseFloat(this.challengeInformation.normalizedScoreToBeat)
          ) {
            result = 'lose';
          }
          const createChallengeReceiveTextCallback = function (data) {
            if (!data.success) {
              console.error(
                'Something went wrong trying to update the challenge to the player'
              );
              return;
            }
            this.challengeReceiveText = ButtonFactoryText(
              this.screenWidth * 0.4,
              this.screenHeight * 0.6,
              `You ${result}!`,
              { fill: '#fff', fontSize: 35 }
            );
            this.addChild(this.challengeReceiveText);
          };
          // update the result to the receiving player
          sendChallenge(
            this.challengeInformation.challengePrimaryKey,
            this.seed,
            this.userInfo.id,
            this.challengeInformation.challengedPlayer,
            normalizedScore,
            'receive',
            result,
            createChallengeReceiveTextCallback.bind(this)
          );
        }
      }
      this.exitText = ButtonFactoryText(
        this.screenWidth * 0.4,
        this.screenHeight * 0.7,
        'Exit Game',
        { fill: '#fff', fontSize: 35 },
        this.returnMenuCallback
      );
      this.addChild(this.exitText);
    }
  }, 10);
};

/**
 * _calculateScore calculates the score user obtain once the guessing time has ended
 *
 */
CardSwap.prototype._calculateScore = function () {
  // guessing time has ran out
  this.isGuessing = false;
  this.isGameEnd = true;
  if (this.targetCardforSelection) {
    this.targetCardforSelection.setLocation(
      this.targetCardforSelection.lastXposition,
      this.targetCardforSelection.lastYposition
    );
    this._removeModalConfident();
  }

  for (const swapCard of this.allSwapCards) {
    swapCard.flipCard(this);
  }
  let totalScore = 0;

  // calculate  the score for each guessed target card
  for (const guessedTargetCardImageLocation of Object.keys(
    this.guessedTargetCards
  )) {
    const info = this.guessedTargetCards[guessedTargetCardImageLocation];
    const guessedSwapCard = info[1];
    let score = info[2];

    if (
      guessedTargetCardImageLocation.localeCompare(
        guessedSwapCard.imageLocation
      ) !== 0
    ) {
      score *= -1;
    }
    totalScore += score;
  }

  // minus the score of all target cards that weren't guessed
  const differences =
    this.allTargetCards.length - Object.keys(this.guessedTargetCards).length;
  totalScore -= differences;

  this.score = totalScore;

  // calculate the user's average 5 most recent game scores including this current one,
  // if 70% at least, then unlock next level
  const getUserMostRecentScores = function () {
    // if empty level information then we create it
    if (!this.userInfo.levelInformation) {
      this.userInfo.levelInformation = {};
      this.userInfo.levelInformation[this.difficulty] = [this.score];
      return [this.score];
    }

    // if empty specific level information then we create it too
    if (!this.userInfo.levelInformation[this.difficulty]) {
      this.userInfo.levelInformation[this.difficulty] = [this.score];
      return [this.score];
    }

    this.userInfo.levelInformation[this.difficulty].push(this.score);
    if (this.userInfo.levelInformation[this.difficulty].length > 5) {
      this.userInfo.levelInformation[this.difficulty].shift();
    }

    return this.userInfo.levelInformation[this.difficulty];
  };

  const mostRecentScores = getUserMostRecentScores.bind(this)();
  const avgRecentScores =
    mostRecentScores.reduce((a, b) => a + b, 0) / mostRecentScores.length;
  // each target card is max 3 score. Since, there is negative we times 2
  const normalizedScore =
    (this.score + this.allTargetCards.length * 3) /
    (this.allTargetCards.length * 3 * 2);

  const scoreThreshold = Math.floor(this.allTargetCards.length * 3 * 0.7);
  // update user level
  // only calculate to level up if this is not a challenge
  if (!this.challengeInformation) {
    // if user exceed 70% of the max score
    if (mostRecentScores.length > 4 && avgRecentScores >= scoreThreshold) {
      if (this.userInfo.level < this.difficulty + 1)
        this.userInfo.level = this.difficulty + 1;
    }
  }

  // add the times played(leaderboard and info), highest level(leaderboard) for this user
  this.userInfo.timesPlayed += 1;
  const self = this;
  updateUser(this.userInfo, (data) => {
    if (!data.success) console.log('error updating user information');

    let leaderboardName = self.userInfo.id;
    if (!self.userInfo.isPublic) leaderboardName = leaderboardName + '_unknown';
    updateLeaderboard(
      leaderboardName,
      'timesPlayed',
      self.userInfo.timesPlayed,
      (data) => {
        if (!data.success) console.error('error updating leaderboard');
        console.log(leaderboardName);
        updateLeaderboard(
          leaderboardName,
          'highestLevel',
          self.userInfo.level,
          (data) => {
            if (!data.success) console.error('error updating leaderboard');
          }
        );
      }
    );
  });

  // calculate function if this is a challenge
  if (this.challengeInformation) {
    // if it is a receiving challenge then we update the player's win/lose values
    if (this.challengeInformation.type === 'receive') {
      // update the current player winning rate
      if (!this.userInfo.wins) this.userInfo.wins = 0;
      if (!this.userInfo.loses) this.userInfo.loses = 0;
      if (
        normalizedScore >
        parseFloat(this.challengeInformation.normalizedScoreToBeat)
      ) {
        this.userInfo.wins++;
      } else if (
        normalizedScore <
        parseFloat(this.challengeInformation.normalizedScoreToBeat)
      ) {
        this.userInfo.loses++;
      }
      const winningRate =
        this.userInfo.wins / (this.userInfo.wins + this.userInfo.loses);
      // update current user win lose and leaderboard winning rate
      updateUser(this.userInfo, (data) => {
        if (!data.success) console.error('error updating user information');
        // update current user win rate
        let leaderboardName = self.userInfo.id;
        if (!self.userInfo.isPublic)
          leaderboardName = leaderboardName + '_unknown';
        updateLeaderboard(
          leaderboardName,
          'winningRate',
          winningRate,
          (data) => {
            if (!data.success) console.error('error updating leaderboard');

            // update the challenged player winning rate
            getUser(this.challengeInformation.challengedPlayer, (data) => {
              if (!data.success)
                console.error('error getting challenged player information');

              challengedUserInfo = data.userInfo;
              if (!challengedUserInfo.wins) challengedUserInfo.wins = 0;
              if (!challengedUserInfo.loses) challengedUserInfo.loses = 0;

              if (
                normalizedScore <
                parseFloat(this.challengeInformation.normalizedScoreToBeat)
              )
                challengedUserInfo.wins++;
              else if (
                normalizedScore >
                parseFloat(this.challengeInformation.normalizedScoreToBeat)
              )
                challengedUserInfo.loses++;

              const challengedUserWinRate =
                challengedUserInfo.wins /
                (challengedUserInfo.wins + challengedUserInfo.loses);

              updateUser(challengedUserInfo, (data) => {
                if (!data.success)
                  console.error('error updating challenged user information');

                let challengedLeaderboardName = challengedUserInfo.id;
                if (!challengedUserInfo.isPublic)
                  challengedLeaderboardName += '_unknown';
                updateLeaderboard(
                  challengedLeaderboardName,
                  'winningRate',
                  challengedUserWinRate,
                  (data) => {
                    if (!data.success)
                      console.error('error updating leaderboard');
                  }
                );
              });
            });
          }
        );
      });
    }
  }

  // show the actual score on the scoreText
  if (this.scoreText) {
    this.removeChild(this.scoreText);
  }
  this._createScoreText();

  const fnIncreaseScoreTextInterval = (mostRecentScores, avgRecentScores) => {
    this._increaseScoreText(mostRecentScores, avgRecentScores, scoreThreshold);
    clearInterval(increaseScoreTextInterval);
  };
  const increaseScoreTextInterval = setInterval(
    fnIncreaseScoreTextInterval.bind(this, mostRecentScores, avgRecentScores),
    3000
  );
};

/********************** Initialization ***********************/
/**
 * _createBackground creates the background for the game. The front panel, side panel and the top panel.
 *
 */
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

/**
 * _createSwapCards creates the swap card and place them into the CardSwap container game area
 *
 */
CardSwap.prototype._createSwapCards = function () {
  // create cards
  for (let i = 0; i < this.numSwapCards; i++) {
    // choose random card
    const cardName = this.allCardNames[
      Math.floor(Math.random() * this.allCardNames.length)
    ];
    this.allCardNames.splice(this.allCardNames.indexOf(cardName), 1); // remove card, must be unique on the table

    // generate card sprite
    this.cardSprite = new Card(
      `resources/Cards/${cardName}.png`,
      this.totalSwap
    );
    this.cardSprite.scale.set(0.6);
    this.cardSprite.x = this.cardPositions[i][0];
    this.cardSprite.y = this.cardPositions[i][1];
    this.cardSprite.anchor.set(0.5);
    this.addChild(this.cardSprite);

    // keep track of the swap cards
    this.allSwapCards.push(this.cardSprite);
  }
};

/**
 * _generateTargetCards chooses the target cards by selecting randomly from the swap cards
 *
 */
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

/**
 * _createTargetCards creates the target cards and place them into the side panel
 *
 */
CardSwap.prototype._createTargetCards = function () {
  // add the target cards to the side panel
  const self = this;
  targetCardMouseDown = function (event) {
    if (self.modalVisible) return; // prevevent clicking on the card when the modal is shown

    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.mouseData = event.data;
    this.dragging = true;
    this.setLastLocation(this.x, this.y);
  };

  targetCardMouseUp = function (self) {
    if (self.isGameEnd) return;
    if (!this.dragging) return;

    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.mouseData = null;

    // check if the targetCard is dropped into the guessingLocation
    let isPlacedIntoGuessing = false;
    if (self.isGuessing) {
      for (const currentSwapCard of self.allSwapCards) {
        // if placed inside the guessing sprite
        if (
          Math.abs(this.x - currentSwapCard.guessingSprite.x) < 30 &&
          Math.abs(this.y - currentSwapCard.guessingSprite.y) < 30
        ) {
          this.x = currentSwapCard.guessingSprite.x;
          this.y = currentSwapCard.guessingSprite.y;
          isPlacedIntoGuessing = true;
          self.targetCardforSelection = this;
          self._drawModalConfident(currentSwapCard, this);
          break;
        }
      }
    }

    // if card not in side panel then we move back to its last location
    if (!isPlacedIntoGuessing) {
      if (this.x < self.screenWidth * 0.8 + this.width * 0.5) {
        this.setLocation(this.lastXposition, this.lastYposition);
      } else {
        // if place in side panel, we remove the score placed
        self.removeChild(this.scoreSprite);
        delete self.guessedTargetCards[this.imageLocation];
      }
    }
  };

  targetCardMouseMove = function (cardSwapContainer) {
    if (cardSwapContainer.isGameEnd) return;
    if (!this.dragging) return;

    var newPosition = this.mouseData.getLocalPosition(this.parent);

    // prevent the target card from going into the game area
    if (!cardSwapContainer.isGuessing) {
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
        .on('mouseup', targetCardMouseUp.bind(targetCard, this))
        .on('mouseupoutside', targetCardMouseUp.bind(targetCard, this))
        .on('touchend', targetCardMouseUp.bind(targetCard, this))
        .on('touchendoutside', targetCardMouseUp.bind(targetCard, this))
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

/**
 * _initializeCards creates all the card for CardSwap game
 *
 */
CardSwap.prototype._initializeCards = function () {
  this.allSwapCards = [];
  this.allTargetCards = [];
  this._createSwapCards();
  this._generateTargetCards();
  this._createTargetCards();
};

/**
 * _createLevelText creates the text for the level
 *
 */
GameContainer.prototype._createLevelText = function () {
  if (this.levelText) {
    this.removeChild(this.levelText);
  }

  const textStyle = { align: 'center', fill: '#ffffff', fontSize: 20 };
  this.levelText = new PIXI.Text(`Level: ${this.difficulty}`, textStyle);
  this.levelText.x = this.screenWidth * 0.5;
  this.levelText.y = this.screenHeight * 0.05;
  this.levelText.anchor.set(0.5);
  this.addChild(this.levelText);
};

GameContainer.prototype._createChallengedPlayerText = function () {
  if (this.challengeInformation) {
    this.challengePlayerText = ButtonFactoryText(
      this.screenWidth * 0.4,
      this.screenHeight * 0.95,
      `challenging player: ${this.challengeInformation.challengedPlayer}`,
      { fill: '#fff', fontSize: 20 }
    );
    this.addChild(this.challengePlayerText);
  }
};

/**
 * _initialize initialize the game
 *
 */
CardSwap.prototype._initialize = function () {
  this._createBackground();
  this._createScoreText();
  this._createLevelText();
  this._initializeCards();
  this._createChallengedPlayerText();
  this._createCountdown(10, this._flipSwapCards.bind(this));
};
