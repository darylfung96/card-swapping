/**
 * This function is the menu class that shows the menu of the game
 *
 * @param {int} width - the width of the canvas game screen
 * @param {int} height - the height of the canvas game screen
 * @param {function} startGameCallback - the function to start game
 */
function Menu(width, height, startGameCallback) {
  PIXI.Container.call(this);

  this.screenWidth = width;
  this.screenHeight = height;

  this.startGameCallback = startGameCallback;

  this.userInfo = null;

  this.self = this;
  this._initialize();
}
Menu.prototype = Object.create(PIXI.Container.prototype);

/**
 * create the background for menu
 */
Menu.prototype._createBackground = function () {
  this.bg = PIXI.Sprite.fromImage('resources/bg/card_background.png');
  this.bg.width = this.screenWidth;
  this.bg.height = this.screenHeight;
  this.bg.alpha = 0.4;

  this.addChild(this.bg);
};

/**
 * Create the title for the menu
 */
Menu.prototype.__createTitle = function () {
  this.title = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.1,
    'CardSwap',
    { fill: '#fff', fontSize: 45 }
  );
  this.addChild(this.title);
};

/**
 * A function that creates the back button in the menu page
 * Use to navigate through different pages of menu
 * @param {*} backCallback - when clicked on this back button, what callback to call
 */
Menu.prototype.__createBackButton = function (backCallback) {
  const backButton = ButtonFactoryText(
    this.screenWidth * 0.1,
    this.screenHeight * 0.1,
    'back',
    { fill: '#fff', fontSize: 20 },
    backCallback
  );
  return backButton;
};

//========================= main page =========================//

/**
 * Create the manu text for the main menu page
 */
Menu.prototype.__createMainTexts = function () {
  const clickCallback = function (page) {
    const pageDict = {
      playgame: this._createPlayPage.bind(this),
      leaderboard: this._createLeaderboardPage.bind(this),
    };

    const callbackFunc = pageDict[page];
    this._removeMainPage();
    callbackFunc();
  };

  this.playGameText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    'Play Game',
    {
      fill: '#fff',
      fontSize: 30,
    },
    clickCallback.bind(this, 'playgame')
  );
  this.leaderboardText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Leaderboards',
    {
      fill: '#fff',
      fontSize: 30,
    },
    clickCallback.bind(this, 'leaderboard')
  );

  // create the text for the privacy
  this.privateCheckbox = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.8,
    'Private mode disabled',
    { fill: '#ccc', fontSize: 20 }
  );
  const drawPrivatePublicText = function () {
    this.removeChild(this.privateCheckbox);
    this.privateCheckbox = ButtonFactoryText(
      this.screenWidth * 0.5,
      this.screenHeight * 0.8,
      `Private mode ${this.userInfo.isPublic ? 'disabled' : 'enabled'}`,
      { fill: `${this.userInfo.isPublic ? '#ccc' : '#fff'}`, fontSize: 20 }
    );
    this.addChild(this.privateCheckbox);
  };

  const updatePrivacyLeaderboard = function () {
    drawPrivatePublicText.bind(this)();
    updateLeaderboard(
      this.userInfo.id,
      'privacy',
      this.userInfo.isPublic,
      (data) => {
        if (!data.success)
          console.error('error updating privacy of leaderboard');
      }
    );
  };
  drawPrivatePublicText.bind(this)();
  const privateToggleCallback = function () {
    this.userInfo.isPublic = !this.userInfo.isPublic;
    updateUser(this.userInfo, updatePrivacyLeaderboard.bind(this));
  };
  this.privateText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.84,
    'Click to toggle',
    { fill: '#fff', fontSize: 18 },
    privateToggleCallback.bind(this)
  );

  this.addChild(this.playGameText);
  this.addChild(this.leaderboardText);
  this.addChild(this.privateText);
};

/**
 * Remove the main page and go to a different page
 */
Menu.prototype._removeMainPage = function () {
  if (this.playGameText) this.removeChild(this.playGameText);
  if (this.leaderboardText) this.removeChild(this.leaderboardText);
  if (this.privateCheckbox) this.removeChild(this.privateCheckbox);
  if (this.privateText) this.removeChild(this.privateText);
};

/**
 * Create the main page menu
 */
Menu.prototype._createMainPage = function () {
  this.__createMainTexts();
};

//========================= initialize =========================//
/**
 * Initialize the menu page
 */
Menu.prototype._initialize = function () {
  this._createBackground();
  this.__createTitle();

  const id = getCookie('id');

  const getUserCallback = function (data) {
    if (!data.success) {
      this._createLoginPage();
      return;
    }
    this.userInfo = data.userInfo;
    this._createMainPage();
  };
  if (!id) {
    this._createLoginPage();
  } else {
    getUser(id, getUserCallback.bind(this));
  }
};
