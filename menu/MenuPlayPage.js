//========================= play game page =========================//
/**
 * Create the play menu page
 */
Menu.prototype._createPlayPage = function () {
  // single player
  const singleCallback = function () {
    this._removePlayPage();
    this._createSinglePage();
  };
  this.singlePlayerText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    'Single Player',
    { fill: '#fff', fontSize: 30 },
    singleCallback.bind(this)
  );
  this.addChild(this.singlePlayerText);

  // challenge player
  const challengeCallback = function () {
    this._removePlayPage();
    this._createChallengePage();
  };
  this.challengeText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Challenge Player',
    { fill: '#fff', fontSize: 30 },
    challengeCallback.bind(this)
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

/**
 * create the single player menu page
 */
Menu.prototype._createSinglePage = function () {
  const backCallback = function () {
    this._removeSinglePage();
    this._createPlayPage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  // solo player
  const soloCallback = function () {
    this.startGameCallback(this.userInfo.level, this.userInfo, null, null);
  };
  this.soloPlayerText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    'Solo Player',
    { fill: '#fff', fontSize: 30 },
    soloCallback.bind(this)
  );
  this.addChild(this.soloPlayerText);

  // play against npc
  const npcCallback = function () {
    this._removeSinglePage();
    this._createNPCPage();
  };
  this.npcPlayerText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Play Against NPC',
    { fill: '#fff', fontSize: 30 },
    npcCallback.bind(this)
  );
  this.addChild(this.npcPlayerText);
};

/**
 * Remove the single menu page
 */
Menu.prototype._removeSinglePage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.soloPlayerText);
  this.removeChild(this.npcPlayerText);
};

//========================= NPC page =========================//

/**
 * Create the page for the NPC menu
 */
Menu.prototype._createNPCPage = function () {
  const backCallback = function () {
    this._removeNPCPage();
    this._createSinglePage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  // NPC levels
  this.easyLevelText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    'Easy',
    { fill: '#fff', fontSize: 30 },
    () => {
      this.startGameCallback(this.userInfo.level, this.userInfo, null, 'easy');
    }
  );
  this.mediumLevelText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Medium',
    { fill: '#fff', fontSize: 30 },
    () => {
      this.startGameCallback(
        this.userInfo.level,
        this.userInfo,
        null,
        'medium'
      );
    }
  );
  this.hardLevelText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.6,
    'Hard',
    { fill: '#fff', fontSize: 30 },
    () => {
      this.startGameCallback(this.userInfo.level, this.userInfo, null, 'hard');
    }
  );
  this.addChild(this.easyLevelText);
  this.addChild(this.mediumLevelText);
  this.addChild(this.hardLevelText);
};

/**
 * Remove the page for the NPC
 */
Menu.prototype._removeNPCPage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.easyLevelText);
  this.removeChild(this.mediumLevelText);
  this.removeChild(this.hardLevelText);
};
