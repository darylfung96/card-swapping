/**
  Main class to render the CardSwap game

 */
function Main() {
  this.width = document.getElementById('game-canvas').width;
  this.height = document.getElementById('game-canvas').height;

  this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
    view: document.getElementById('game-canvas'),
  });

  // create splash screen to render
  this.renderingContainer = new SplashScreen(
    this.width,
    this.height,
    this.startGameCallback.bind(this)
  );
  requestAnimationFrame(this.update.bind(this));
}

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
 * startGameCallback is a function that starts the CardSwap game by changing the renderingContainer inside Main class
 */
Main.prototype.startGameCallback = function () {
  const difficulty = parseInt(getUrlParameter('difficulty')) || 1;
  const seed = getUrlParameter('seed') || '1';
  const npc = getUrlParameter('npc') || null;
  let numPlayers = getUrlParameter('numPlayers') || null;

  // max player is 4 and min player is 1
  if (numPlayers !== null) {
    numPlayers = Math.min(Math.max(1, numPlayers), 4);
  }

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

/**
 * update is a function that loop updates for pixijs to render
 */
Main.prototype.update = function () {
  this.renderer.render(this.renderingContainer.render);
  requestAnimationFrame(this.update.bind(this));
};
