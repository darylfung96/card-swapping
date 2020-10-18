//========================= play game page =========================//
Menu.prototype._createPlayPage = function () {
  const singleCallback = function () {
    this._removePlayPage();
    this._createSinglePage();
  };
  // single player
  this.singlePlayerText = this.__createText(
    'Single Player',
    { fill: '#fff', fontSize: 30 },
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    singleCallback.bind(this)
  );
  this.addChild(this.singlePlayerText);

  // challenge player
  this.challengeText = this.__createText(
    'Challenge Player',
    { fill: '#fff', fontSize: 30 },
    this.screenWidth * 0.5,
    this.screenHeight * 0.5
  );
  this.addChild(this.challengeText);

  const backButton = function () {
    this._removePlayPage();
    this._createMainPage();
  };

  this.backButton = this.__createBackButton(backButton.bind(this));
  this.addChild(this.backButton);
};
Menu.prototype._removePlayPage = function () {
  this.removeChild(this.singlePlayerText);
  this.removeChild(this.challengeText);
  this.removeChild(this.backButton);
};

//========================= single player page =========================//
Menu.prototype.__createSingleLevels = function () {
  const email = getCookie('email');
  const self = this;
  self.singleLevels = [];

  const startingRow = this.screenHeight * 0.3;
  const startingCol = this.screenWidth * 0.3;
  const spacing = this.screenWidth * 0.15;

  const createLevels = function (data) {
    if (!data.success) {
      console.log(`error: ${data.msg}`);
      return;
    }
    const level = data.userInfo.level || 1;

    const mouseOver = function () {
      console.log('a');
      this.width *= 1.1;
    };
    const mouseOut = function () {
      this.width /= 1.1;
    };
    // add levels
    for (let i = 0; i < level; i++) {
      const currentLevel = new PIXI.Sprite.fromImage(
        'resources/bg/card_background.png'
      );
      currentLevel.width = self.screenWidth * 0.1;
      currentLevel.height = self.screenHeight * 0.1;
      currentLevel.x = startingCol + spacing * Math.floor(i % 4);
      currentLevel.y = startingRow + spacing * Math.floor(i / 4);
      currentLevel.anchor.set(0.5);
      currentLevel.alpha = 0.4;
      currentLevel.interactive = true;
      currentLevel.buttonMode = true;
      currentLevel
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .on('mousedown', () => {
          self.startGameCallback(i + 1, self.userInfo);
        });
      const currentLevelText = new PIXI.Text(`level ${i + 1}`, {
        fill: '#fff',
        fontSize: 20,
        fontWeight: '500',
      });
      currentLevelText.x = startingCol + spacing * Math.floor(i % 4);
      currentLevelText.y = startingRow + spacing * Math.floor(i / 4);
      currentLevelText.anchor.set(0.5);

      self.singleLevels.push(currentLevel);
      self.singleLevels.push(currentLevelText);
      self.addChild(currentLevel);
      self.addChild(currentLevelText);
    }
  };

  getUser(email, createLevels);
};

Menu.prototype._createSinglePage = function () {
  const backCallback = function () {
    this._removeSinglePage();
    this._createPlayPage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  this.__createSingleLevels();
};

Menu.prototype._removeSinglePage = function () {
  this.removeChild(this.backButton);
};
