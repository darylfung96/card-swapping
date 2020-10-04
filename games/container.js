function GameContainer(screenWidth, screenHeight) {
  PIXI.Container.call(this);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.paused = false;

  this.score = 0;
  this.scoreText = false;
}
GameContainer.prototype = Object.create(PIXI.Container.prototype);

GameContainer.prototype.endMainGame = function () {
  if (this.timer) {
    clearInterval(this.timer);
  }

  if (this.startCountdown) {
    clearInterval(this.startCountdown);
  }
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
GameContainer.prototype._createCountdown = function (
  startingCountdownTime,
  endCountdownCallback
) {
  let countdownValue = startingCountdownTime;

  const countdownSound = new Audio('resources/audio/countdown.mp3');
  const countdownEndSound = new Audio('resources/audio/countdown_end.mp3');

  const fontStyle = { align: 'center', fill: '#fff', fontSize: 20 };
  this.countdownText = new PIXI.Text(
    'Timer: ' + countdownValue.toString(),
    fontStyle
  );
  this.countdownText.x = this.screenWidth * 0.8;
  this.countdownText.y = this.screenHeight * 0.03;
  this.addChild(this.countdownText);

  this.startCountdown = setInterval(() => {
    // don't countdown if paused
    if (this.paused) return;

    this.removeChild(this.countdownText);
    this.countdownText = new PIXI.Text(
      'Timer: ' + countdownValue.toString(),
      fontStyle
    );
    this.countdownText.x = this.screenWidth * 0.8;
    this.countdownText.y = this.screenHeight * 0.03;

    this.addChild(this.countdownText);

    if (countdownValue != 0) countdownSound.play();
    else countdownEndSound.play();

    if (countdownValue == 0) {
      clearInterval(this.startCountdown);
      this.startCountdown = false;
      this.removeChild(this.countdownText);
      endCountdownCallback();
    }
    countdownValue--;
  }, 1000);
};

GameContainer.prototype._createScoreText = function () {
  if (this.scoreText) {
    this.removeChild(this.scoreText);
  }

  const textStyle = { align: 'center', fill: '#ffffff', fontSize: 20 };
  this.scoreText = new PIXI.Text(`Score: ${this.score}`, textStyle);
  this.scoreText.x = this.screenWidth * 0.05;
  this.scoreText.y = this.screenHeight * 0.03;
  this.addChild(this.scoreText);
};
