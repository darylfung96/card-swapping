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

  const self = this;
  const startCallback = function (difficulty) {
    self.startGameCallback(difficulty);
  };
  // create splash screen to render
  this.renderingContainer = new Menu(this.width, this.height, startCallback);
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
 * getUrlParameter receives the query parameter from the url
 * @param {string} name - The name of the query parameter
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * This function creates a random string
 *
 * @param {int} length - the length of the randomize string
 */
function createRandomString(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * startGameCallback is a function that starts the CardSwap game by changing the renderingContainer inside Main class
 */
Main.prototype.startGameCallback = function (difficulty) {
  let seed = getUrlParameter('seed') || '1';
  const npc = getUrlParameter('npc') || null;
  let numPlayers = getUrlParameter('numPlayers') || null;

  // max player is 4 and min player is 1
  if (numPlayers !== null) {
    numPlayers = Math.min(Math.max(1, numPlayers), 4);
  }

  // randomize the seed
  seed = createRandomString(10);

  if (numPlayers) {
    this.renderingContainer = new CardSwapMultiplayerContainer(
      this.width,
      this.height,
      difficulty,
      seed,
      numPlayers
    );
  } else {
    this.renderingContainer = new CardSwap(
      this.width,
      this.height,
      difficulty,
      seed,
      npc
    );
  }
};
