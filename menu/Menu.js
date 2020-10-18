function Menu(width, height, startGameCallback) {
  PIXI.Container.call(this);

  this.screenWidth = width;
  this.screenHeight = height;

  this.startGameCallback = startGameCallback;

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
  this.title = this.__createText(
    'CardSwap',
    { fill: '#fff', fontSize: 45 },
    this.screenWidth * 0.5,
    this.screenHeight * 0.1
  );
  this.addChild(this.title);
};

Menu.prototype.__createBackButton = function (backCallback) {
  const backButton = this.__createText(
    'back',
    { fill: '#fff', fontSize: 20 },
    this.screenWidth * 0.1,
    this.screenHeight * 0.1,
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

  this.playGameText = this.__createText(
    'Play Game',
    {
      fill: '#fff',
      fontSize: 30,
    },
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    clickCallback.bind(this, 'playgame')
  );
  this.leaderboardText = this.__createText(
    'Leaderboards',
    {
      fill: '#fff',
      fontSize: 30,
    },
    this.screenWidth * 0.5,
    this.screenHeight * 0.5
  );

  this.addChild(this.playGameText);
  this.addChild(this.leaderboardText);
};

Menu.prototype.__createLogoutText = function () {
  const self = this;
  const logoutCallback = function () {
    setCookie('email', '', -1);
    self._removeMainPage();
    self._createLoginPage();
  };
  this.logoutText = this.__createText(
    'Logout',
    { fill: '#fff', fontSize: 20 },
    this.screenWidth * 0.9,
    this.screenHeight * 0.1,
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

  const email = getCookie('email');
  if (!email) {
    this._createLoginPage();
  } else {
    getUser(email, this._createMainPage.bind(this));
  }
};
