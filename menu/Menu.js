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

Menu.prototype.__createText = function (text, textStyle, x, y, clickCallback) {
  const textCreated = new PIXI.Text(text, textStyle);
  textCreated.x = x;
  textCreated.y = y;
  textCreated.anchor.set(0.5);
  if (typeof clickCallback === 'function') {
    textCreated.interactive = true;
    textCreated.buttonMode = true;
    textCreated.on('mousedown', clickCallback);
    textCreated.on('touchstart', clickCallback);
  }

  return textCreated;
};

Menu.prototype._createBackground = function () {
  this.bg = PIXI.Sprite.fromImage('resources/bg/card_background.png');
  this.bg.width = this.screenWidth;
  this.bg.height = this.screenHeight;
  this.bg.alpha = 0.4;

  this.addChild(this.bg);
};

Menu.prototype.__createTitle = function () {
  this.title = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.1,
    'CardSwap',
    { fill: '#fff', fontSize: 45 }
  );
  this.addChild(this.title);
};

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

Menu.prototype.__createMainTexts = function () {
  const clickCallback = function (page) {
    const pageDict = { playgame: this._createPlayPage.bind(this) };

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
    }
  );

  this.addChild(this.playGameText);
  this.addChild(this.leaderboardText);
};

Menu.prototype.__createLogoutText = function () {
  const self = this;
  const logoutCallback = function () {
    setCookie('id', '', -1);
    self._removeMainPage();
    self._createLoginPage();
  };
  this.logoutText = ButtonFactoryText(
    this.screenWidth * 0.9,
    this.screenHeight * 0.1,
    'Logout',
    { fill: '#fff', fontSize: 20 },
    logoutCallback
  );
  this.addChild(this.logoutText);
};

Menu.prototype._removeMainPage = function () {
  if (this.playGameText) this.removeChild(this.playGameText);
  if (this.leaderboardText) this.removeChild(this.leaderboardText);
  if (this.logoutText) this.removeChild(this.logoutText);
};

Menu.prototype._createMainPage = function () {
  this.__createMainTexts();
  this.__createLogoutText();
};

//========================= leaderboard =========================//

//========================= initialize =========================//
Menu.prototype._initialize = function () {
  this._createBackground();
  this.__createTitle();

  const id = getCookie('id');

  const getUserCallback = function (data) {
    if (data.success) {
      this.userInfo = data.userInfo;
      this._createMainPage();
    }
  };
  if (!id) {
    this._createLoginPage();
  } else {
    getUser(id, getUserCallback.bind(this));
  }
};
