/**
 * GameContainer is the game container that contains general function
 *
 * @param {int} screenWidth - the width of the game area
 * @param {int} screenHeight - the height of the game area
 */
function GameContainer(screenWidth, screenHeight) {
  PIXI.Container.call(this);

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.paused = false;

  this.score = 0;
  this.scoreText = false;
}
GameContainer.prototype = Object.create(PIXI.Container.prototype);

/**
 * _createCountdown creates the timer in the upper right for remembering, swapping, and guessing
 *
 * @param {int} startingCountdownTime - the seconds to start countdown down
 * @param {function} endCountdownCallback - the function to call after the countdown has reached 0
 */
GameContainer.prototype._createCountdown = function (
  startingCountdownTime,
  endCountdownCallback
) {
  let countdownValue = startingCountdownTime;

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

    if (countdownValue <= 0) {
      clearInterval(this.startCountdown);
      this.startCountdown = false;
      this.removeChild(this.countdownText);
      endCountdownCallback();
    }
    countdownValue--;
  }, 1000);
};

/**
 * _createScoreText creates the text for the score
 *
 */
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
