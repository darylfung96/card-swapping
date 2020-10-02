function GamePage(screenWidth, screenHeight, spriteImageLocation, description) {
  this.children = [];

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.description = description;

  this.spriteImage = new PIXI.Sprite.fromImage(spriteImageLocation);
}

GamePage.prototype._createTitle = function () {
  this.spriteImage.position.x = this.screenWidth * 0.7;
  this.spriteImage.position.y = this.screenHeight / 6;
  this.spriteImage.anchor.set(0.5);
  this.spriteImage.width = this.screenWidth * 0.4;
  this.spriteImage.height = this.screenHeight * 0.3;
  this.children.push(this.spriteImage);
};

GamePage.prototype._createDescription = function () {
  var textStyle = {
    fill: '#ffffff',
    fontSize: 20,
    align: 'center',
  };
  var text = new PIXI.Text(this.description, textStyle);
  text.x = this.screenWidth / 2;
  text.y = this.screenHeight / 2.5;
  text.anchor.x = 0.5;

  this.children.push(text);
};

GamePage.prototype._initialize = function () {
  this._createTitle();
  this._createDescription();
};
