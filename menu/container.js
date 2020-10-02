/*
  width:                          the width of the game canvas
  height:                         the height of the game canvas
  changeContainerCallback:        the callback to change the rendering container from the Main.js
*/
function Menu(width, height, changeMainContainerCallback) {
  PIXI.Container.call(this);

  this.changeMainContainerCallback = changeMainContainerCallback;

  this.screenWidth = width;
  this.screenHeight = height;

  this.BUTTON_SPACING = this.screenHeight / 6;

  // make the button on the center of width
  this.buttonX = this.screenWidth / 2;

  // create the position y for the buttons
  this.selectGameButtonY = this.screenHeight / 3;
  this.exitGameButtonY = this.selectGameButtonY + this.BUTTON_SPACING;

  // add background
  this._addBackground();
  this._initialize();

  // show home page first when initializing
  this._displayHomeMenu();
}
Menu.prototype = Object.create(PIXI.Container.prototype);

Menu.prototype._addBackground = function () {
  this.bg = new PIXI.Sprite.fromImage('resources/bg/brain_bg.jpg');
  this.bg.alpha = 0.7;
  this.bg.width = this.screenWidth;
  this.bg.height = this.screenHeight;
  this.addChild(this.bg);
};

Menu.prototype._displayHomeMenu = function () {
  // clear all children
  // add a check to remove only if more than 1 child, because the 1st child is background
  if (this.children.length > 1) this.removeChildren(1, this.children.length);

  // add all children for home page
  for (var child of this.homePage.children) {
    this.addChild(child);
  }
};

Menu.prototype._displaySelectGamesMenu = function () {
  // clear all children
  // add a check to remove only if more than 1 child, because the 1st child is background
  if (this.children.length > 1) this.removeChildren(1, this.children.length);
  for (var child of this.selectGamesPage.children) {
    this.addChild(child);
  }
};

Menu.prototype._initialize = function () {
  this.homePage = new HomePage(
    this.screenWidth,
    this.screenHeight,
    this._displaySelectGamesMenu.bind(this)
  );
  this.selectGamesPage = new SelectGamesPage(
    this.screenWidth,
    this.screenHeight,
    this._displayHomeMenu.bind(this),
    this._displaySelectGamesMenu.bind(this),
    this.changeMainContainerCallback
  );
};
