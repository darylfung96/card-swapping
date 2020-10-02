function HomePage(width, height, selectGamesButtonClick) {
  this.selectGamesButtonClick = selectGamesButtonClick;

  this.screenWidth = width;
  this.screenHeight = height;

  this.children = [];

  this.BUTTON_SPACING = this.screenHeight / 6;

  // make the button on the center of width
  this.buttonX = this.screenWidth / 2;

  // create the position y for the buttons
  this.titleY = this.screenHeight / 7;
  this.selectGameButtonY = this.screenHeight / 2;

  // add background
  this._initialize();
}

HomePage.prototype._createTitle = function () {
  this.title = new PIXI.Text('CardSwap', {
    fontSize: 30,
    fill: '#ffffff',
    align: 'center',
  });
  this.title.x = this.buttonX;
  this.title.y = this.titleY;
  this.title.anchor.set(0.5);
};

HomePage.prototype._createSelectGameButton = function () {
  this.startGameButton = ButtonFactorySprite(
    this.buttonX,
    this.selectGameButtonY,
    'resources/buttons/Menu/button_play-game_before.png',
    'resources/buttons/Menu/button_play-game_after.png',
    this.selectGamesButtonClick
  );
};

HomePage.prototype._initialize = function () {
  this._createSelectGameButton();
  this._createTitle();

  this.children.push(this.startGameButton);
  this.children.push(this.title);
};
