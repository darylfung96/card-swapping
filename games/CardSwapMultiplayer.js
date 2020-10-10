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

CardSwapMultiplayer.prototype.destroySelf = function () {
  while (this.children[0]) {
    this.removeChild(this.children[0]);
  }
  this.destroy(true);
};

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
  this.playerText = new PIXI.Text(`Player: ${this.currentPlayer}`, textStyle);
  this.playerText.x = this.screenWidth * 0.2;
  this.playerText.y = this.screenHeight * 0.03;
  this.addChild(this.playerText);
};

CardSwapMultiplayer.prototype._initialize = function () {
  this._createBackground();
  this._createScoreText();
  this._initializeCards();
  this._createPlayerText();
  this._createCountdown(10, this._flipSwapCards.bind(this));
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

  this.currentPlayer = 0;
  this._startGame(this.currentPlayer);
}

CardSwapMultiplayerContainer.prototype._startGame = function (currentPlayer) {
  this.render = new CardSwapMultiplayer(
    this.screenWidth,
    this.screenHeight,
    this.difficulty,
    this.seed,
    currentPlayer,
    this._playerEndGame.bind(this)
  );
};

CardSwapMultiplayerContainer.prototype._playerEndGame = function () {
  this.playerScores.push(this.render.score);
  this.currentPlayer++;

  this.render.destroySelf();

  if (this.currentPlayer < this.numPlayers) {
    this._startGame(this.currentPlayer);
  } else {
    // show the scores
  }
};
