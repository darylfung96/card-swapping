/**
 * CardSwap game container runs the CardSwap in multiplayer, this cardSwap container
 * is the same as CardSwap but the way it calculate score is different
 * it will not show the text of the scores when the player finished guessing but will
 * go to the next player instead.
 *
 * @param {int} screenWidth - the width of the game screen
 * @param {int} screenHeight - the height of the game screen
 * @param {int} difficulty - the difficulty of the game
 * @param {string} seed - the seed provided to randomize the card swapping
 * @param {string} npc - if there is an npc that player is playing against (hard, medium, easy)
 * @param {int} currentPlayer - which player is playing right now
 * @param {function} gameEndCallback - function to be called when this player finished guessing
 */
function CardSwapMultiplayer(
  screenWidth,
  screenHeight,
  difficulty,
  seed,
  currentPlayer,
  gameEndCallback
) {
  this.gameEndCallback = gameEndCallback;
  this.currentPlayer = currentPlayer;
  CardSwap.call(this, screenWidth, screenHeight, difficulty, seed, null); // npc is null
}
CardSwapMultiplayer.prototype = Object.create(CardSwap.prototype);

CardSwapMultiplayer.prototype._calculateScore = function () {
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

  this.gameEndCallback();
};

CardSwapMultiplayer.prototype._createPlayerText = function () {
  const textStyle = { align: 'center', fill: '#ffffff', fontSize: 20 };
  this.playerText = new PIXI.Text(`Player ${this.currentPlayer}`, textStyle);
  this.playerText.x = this.screenWidth * 0.2;
  this.playerText.y = this.screenHeight * 0.03;
  this.addChild(this.playerText);
};

CardSwapMultiplayer.prototype._initialize = function () {
  CardSwap.prototype._initialize.call(this);
  this._createPlayerText();
};

//=====================  ===================== ===================== //

/**
 * CardSwap game container runs the CardSwap in multiplayer, this cardSwap container
 * is the same as CardSwap but the way it calculate score is different
 * it will not show the text of the scores when the player finished guessing but will
 * go to the next player instead.
 *
 * @param {int} screenWidth - the width of the game screen
 * @param {int} screenHeight - the height of the game screen
 * @param {int} difficulty - the difficulty of the game
 * @param {string} seed - the seed provided to randomize the card swapping
 * @param {int} numPlayers - number of players
 */
function CardSwapMultiplayerContainer(
  screenWidth,
  screenHeight,
  difficulty,
  seed,
  numPlayers
) {
  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;
  this.difficulty = difficulty;
  this.seed = seed;
  this.numPlayers = numPlayers;
  this.playerScores = [];

  this.prePlayContainer = new PIXI.Container();

  this.currentPlayer = 0;
  this._startGame(this.currentPlayer);
}

CardSwapMultiplayerContainer.prototype._startGame = function (currentPlayer) {
  while (this.prePlayContainer.children[0]) {
    this.prePlayContainer.removeChild(this.prePlayContainer.children[0]);
  }
  this.render = this.prePlayContainer;

  const playerEndText = new PIXI.Text(`Player ${this.currentPlayer} turn`, {
    fill: '#fff',
    fontSize: 35,
  });
  playerEndText.x = this.screenWidth * 0.5;
  playerEndText.y = this.screenHeight * 0.5;
  playerEndText.anchor.set(0.5);
  this.render.addChild(playerEndText);

  const self = this;
  const startNextPlayerGameInterval = setInterval(() => {
    self.render.removeChild(playerEndText);
    self.render = new CardSwapMultiplayer(
      this.screenWidth,
      this.screenHeight,
      this.difficulty,
      this.seed,
      currentPlayer,
      this._playerEndGame.bind(this)
    );
    clearInterval(startNextPlayerGameInterval);
  }, 2000);
  // end of destroying the current player rendering
};

CardSwapMultiplayerContainer.prototype._showEndScores = function () {
  while (this.prePlayContainer.children[0]) {
    this.prePlayContainer.removeChild(this.prePlayContainer.children[0]);
  }
  this.render = this.prePlayContainer;

  for (let i = 0; i < this.numPlayers; i++) {
    const currentPlayerText = new PIXI.Text(
      `Player ${i} scored: ${this.playerScores[i]}`,
      {
        fill: '#fff',
        fontSize: 35,
      }
    );

    currentPlayerText.x = this.screenWidth * 0.5;
    currentPlayerText.y = this.screenHeight * (0.1 + 0.1 * i);
    currentPlayerText.anchor.set(0.5);
    this.render.addChild(currentPlayerText);
  }
};

CardSwapMultiplayerContainer.prototype._playerEndGame = function () {
  this.playerScores.push(this.render.score);
  this.currentPlayer++;

  // destroy the current player rendering
  while (this.render.children[0]) {
    this.render.removeChild(this.render.children[0]);
  }
  this.render.destroy(true);

  // start the rendering for the next player
  if (this.currentPlayer < this.numPlayers) {
    this._startGame(this.currentPlayer);
  } else {
    // show the scores
    this._showEndScores();
  }
};
