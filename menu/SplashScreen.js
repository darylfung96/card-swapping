/*
  width:                          the width of the game canvas
  height:                         the height of the game canvas
  changeContainerCallback:        the callback to change the rendering container from the Main.js
*/
function SplashScreen(width, height, startGameCallback) {
  PIXI.Container.call(this);
  this.startGameCallback = startGameCallback;

  this.screenWidth = width;
  this.screenHeight = height;

  this._addBackground();
  this._initialize();
}
SplashScreen.prototype = Object.create(PIXI.Container.prototype);

SplashScreen.prototype._addBackground = function () {
  this.bg = new PIXI.Sprite.fromImage('resources/bg/blue_bg.png');
  this.bg.alpha = 1;
  this.bg.width = this.screenWidth;
  this.bg.height = this.screenHeight;
  this.addChild(this.bg);
};

SplashScreen.prototype._initialize = function () {
  this.title = new PIXI.Text('How To Play', {
    fontSize: 18,
    fill: '#fff',
    fontWeight: 'bold',
    align: 'center',
  });
  this.title.x = this.screenWidth * 0.05;
  this.title.y = this.screenHeight * 0.2;

  this.ruleTitle = new PIXI.Text('Rules:', {
    fontSize: 18,
    fill: '#fff',
    fontWeight: 'bold',
    align: 'center',
  });
  this.ruleTitle.x = this.screenWidth * 0.1;
  this.ruleTitle.y = this.screenHeight * 0.3;

  this.pointsText = new PIXI.Text(
    '1.	Keep track of the target cards as they get swapped around.\n' +
      '2.	Select their new location and win.\n' +
      '3. The more confident you are, the more points you get!\n' +
      '4. But, if you are wrong, you lose points.',
    {
      fontSize: 18,
      fontWeight: 'normal',
      fill: '#fff',
      align: 'left',
    }
  );
  this.pointsText.x = this.screenWidth * 0.1;
  this.pointsText.y = this.screenHeight * 0.35;

  this.movementTitle = new PIXI.Text('Movement:', {
    fontSize: 18,
    fill: '#fff',
    fontWeight: 'bold',
    align: 'center',
  });
  this.movementTitle.x = this.screenWidth * 0.1;
  this.movementTitle.y = this.screenHeight * 0.5;

  this.movementPointText = new PIXI.Text(
    '1.	After the cards are swapped, drag and drop your target cards to their new location.',
    {
      fontSize: 18,
      fontWeight: 'normal',
      fill: '#fff',
      align: 'left',
    }
  );
  this.movementPointText.x = this.screenWidth * 0.1;
  this.movementPointText.y = this.screenHeight * 0.55;

  this.playText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.8,
    'Play',
    {
      fontSize: 30,
      fontWeight: 'normal',
      fill: '#fff',
      align: 'left',
    },
    this.startGameCallback
  );

  this.addChild(this.title);
  this.addChild(this.ruleTitle);
  this.addChild(this.pointsText);
  this.addChild(this.movementTitle);
  this.addChild(this.movementPointText);
  this.addChild(this.playText);
};
