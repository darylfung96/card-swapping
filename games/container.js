function GameContainer(screenWidth, screenHeight, changeMainContainerCallback) {
  PIXI.Container.call(this);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.changeMainContainerCallback = changeMainContainerCallback;

  this.paused = false;

  this.score = 0;
  this.scoreText = false;

  this._initializeContainer();
}
GameContainer.prototype = Object.create(PIXI.Container.prototype);

GameContainer.prototype._createPauseMenu = function () {
  this.pauseBackground = new PIXI.Sprite.fromImage('resources/bg/white_bg.jpg');
  this.pauseBackground.width = this.screenWidth;
  this.pauseBackground.height = this.screenHeight;
  this.pauseBackground.alpha = 0.2;

  this.pauseMenu = new PIXI.Sprite.fromImage('resources/bg/white_bg.jpg');
  this.pauseMenu.tint = '#000000';
  this.pauseMenu.width = this.screenWidth * 0.6;
  this.pauseMenu.height = this.screenHeight * 0.6;
  this.pauseMenu.position.x = this.screenWidth / 2;
  this.pauseMenu.position.y = this.screenHeight / 2;
  this.pauseMenu.anchor.set(0.5);
  this.pauseMenu.alpha = 0.5;

  const textStyle = {
    fontSize: 40,
    fill: '#ffffff',
    align: 'center',
  };
  this.pauseTitle = new PIXI.Text('Paused', textStyle);
  this.pauseTitle.x = this.screenWidth / 2;
  this.pauseTitle.y = this.screenHeight / 4;
  this.pauseTitle.anchor.set(0.5);

  const pauseButtonX = this.screenWidth / 2;
  const pauseButtonY = this.screenHeight / 2;

  const exitCallback = () => {
    this.changeMainContainerCallback('menu');
  };

  this.pauseButton = ButtonFactoryText(
    pauseButtonX,
    pauseButtonY,
    'Exit Game',
    {
      ...textStyle,
      fontSize: 30,
    },
    exitCallback
  );
};

GameContainer.prototype.endMainGame = function () {
  this.escapeKey.unsubscribe();
  if (this.timer) {
    clearInterval(this.timer);
  }

  if (this.startCountdown) {
    clearInterval(this.startCountdown);
  }
};

GameContainer.prototype._createEscapeKeyInput = function () {
  this.escapeKey = keyboard('Escape');

  const pauseGame = () => {
    this.addChild(this.pauseBackground);
    this.addChild(this.pauseMenu);
    this.addChild(this.pauseTitle);
    this.addChild(this.pauseButton);
  };

  const resumeGame = () => {
    this.removeChild(this.pauseBackground);
    this.removeChild(this.pauseMenu);
    this.removeChild(this.pauseTitle);
    this.removeChild(this.pauseButton);
  };

  this.escapeKey.release = () => {
    this.paused = !this.paused;
    // add or remove the escape menu children
    if (this.paused) {
      pauseGame();
    } else {
      resumeGame();
    }
  };
};

GameContainer.prototype._createTimeTicking = function (endFunction) {
  this.timeLeft = 60;
  this.timer = setInterval(() => {
    // don't countdown if the game is paused
    if (this.paused) return;

    this.removeChild(this.timeTicking);
    this.timeLeft--;
    this.timeTicking = new PIXI.Text(this.timeLeft.toString(), {
      fontSize: 20,
      fill: '#ffffff',
      align: 'center',
    });
    this.timeTicking.x = this.screenWidth * 0.9;
    this.timeTicking.y = this.screenHeight * 0.05;
    this.addChild(this.timeTicking);

    if (this.timeLeft == 0) {
      clearInterval(this.timer);
      this.timer = false;
      this.endMainGame();
      endFunction();
      // then do something about the children of this container
    }
  }, 1000);
};

/*
startGameCallback is a callback to trigger drawing of the game graphics
*/
GameContainer.prototype._createStartingCountdown = function (
  startGameCallback
) {
  this.countdownValue = 3;
  const countdownSound = new Audio('resources/audio/countdown.mp3');
  const countdownEndSound = new Audio('resources/audio/countdown_end.mp3');

  const fontStyle = { align: 'center', fill: '#000000', fontSize: 50 };
  this.countdownText = new PIXI.Text(this.countdownValue.toString(), fontStyle);
  this.countdownText.x = this.screenWidth / 2;
  this.countdownText.y = this.screenHeight / 2;
  this.countdownText.anchor.set(0.5);

  this.startCountdown = setInterval(() => {
    // don't countdown if paused
    if (this.paused) return;

    this.removeChild(this.countdownText);
    this.countdownText = new PIXI.Text(
      this.countdownValue.toString(),
      fontStyle
    );
    this.countdownText.x = this.screenWidth / 2;
    this.countdownText.y = this.screenHeight / 2;
    this.countdownText.anchor.set(0.5);

    this.addChild(this.countdownText);

    if (this.countdownValue != 0) countdownSound.play();
    else countdownEndSound.play();

    if (this.countdownValue == 0) {
      clearInterval(this.startCountdown);
      this.startCountdown = false;
      this.removeChild(this.countdownText);
      startGameCallback();
    }
    this.countdownValue--;
  }, 1000);
};

GameContainer.prototype._createScoreText = function () {
  if (this.scoreText) {
    this.removeChild(this.scoreText);
  }

  const textStyle = { align: 'center', fill: '#ffffff', fontSize: 20 };
  this.scoreText = new PIXI.Text(`Score: ${this.score}`, textStyle);
  this.scoreText.x = this.screenWidth * 0.1;
  this.scoreText.y = this.screenHeight * 0.1;
  this.addChild(this.scoreText);
};

GameContainer.prototype._initializeContainer = function () {
  this._createPauseMenu();
  this._createEscapeKeyInput();
};
