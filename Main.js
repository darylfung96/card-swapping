/*
  Our hierarchical rendering will be:
  Menu to render Menu container
  different Games Container

  Current containers are:
  MenuContainer
  SpeedyContainer

  There is a callback that change the renderingContainer from the Main.js that will be pass into 
  the containers.

 */
function Main() {
  this.width = document.getElementById('game-canvas').width;
  this.height = document.getElementById('game-canvas').height;

  this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
    view: document.getElementById('game-canvas'),
  });

  this.renderingContainer = new SplashScreen(
    this.width,
    this.height,
    this.changeMainContainerCallback.bind(this)
  );
  requestAnimationFrame(this.update.bind(this));
}

// this callback is use to change the rendering container
Main.prototype.changeMainContainerCallback = function (gameName) {
  // if (this.games[gameName] === undefined) console.log('game not found');
  // this.renderingContainer = new this.games[gameName](
  //   this.width,
  //   this.height,
  //   this.changeMainContainerCallback.bind(this)
  // );
};

Main.prototype.update = function () {
  this.renderer.render(this.renderingContainer);
  requestAnimationFrame(this.update.bind(this));
};
