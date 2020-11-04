/**
  Main class to render the CardSwap game

 */
function Main() {
  this.width = document.getElementById('game-canvas').width;
  this.height = document.getElementById('game-canvas').height;

  this.renderer = PIXI.autoDetectRenderer({
    width: this.width,
    height: this.height,
    view: document.getElementById('game-canvas'),
  });

  this.renderingContainer = new Menu(
    this.width,
    this.height,
    this.startGameCallback.bind(this)
  );
  requestAnimationFrame(this.update.bind(this));
}

/**
 * update is a function that loop updates for pixijs to render
 */
Main.prototype.update = function () {
  this.renderer.render(this.renderingContainer.self);
  requestAnimationFrame(this.update.bind(this));
};

/**
 * this function returns to main menu
 */
Main.prototype.returnMenuCallback = function () {
  this.renderingContainer = new Menu(
    this.width,
    this.height,
    this.startGameCallback.bind(this)
  );
};

/**
 * startGameCallback is a function that starts the CardSwap game by changing the renderingContainer inside Main class
 * @param {int} difficulty - The level of the cardswap game
 * @param {object} userInfo - the information of the current  player
 * @param {object} challengeInformation - The challenge information if applicable {type: 'receive'or'send', challengedPlayer: 'playerChallenged', normalizedScoreToBeat: 'normalized score to beat', 'seed': seedValue}
 * @param {boolean} isNPC - is playing against
 */
Main.prototype.startGameCallback = function (
  difficulty,
  userInfo,
  challengeInformation,
  npcLevel
) {
  // randomize the seed
  let seed = createRandomString(10);
  if (challengeInformation && challengeInformation.seed) {
    seed = challengeInformation.seed;
  }

  this.renderingContainer = new CardSwap(
    this.width,
    this.height,
    difficulty,
    seed,
    npcLevel,
    userInfo,
    challengeInformation || null,
    this.startGameCallback.bind(this),
    this.returnMenuCallback.bind(this)
  );
};
