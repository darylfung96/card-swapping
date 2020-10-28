//========================= play game page =========================//
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
Menu.prototype._createSinglePage = function () {
  const backCallback = function () {
    this._removeSinglePage();
    this._createPlayPage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  // solo player
  const soloCallback = function () {
    this._removeSinglePage();
    this._createSoloPage();
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

Menu.prototype._removeSinglePage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.soloPlayerText);
  this.removeChild(this.npcPlayerText);
};

//========================= NPC page =========================//
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
Menu.prototype._removeNPCPage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.easyLevelText);
  this.removeChild(this.mediumLevelText);
  this.removeChild(this.hardLevelText);
};

//========================= solo player page =========================//
Menu.prototype.__createSoloLevels = function () {
  const id = getCookie('id');
  const self = this;
  self.soloLevels = [];

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
      const currentStartCallback = () => {
        self.startGameCallback(i + 1, self.userInfo, null, null);
      };
      currentLevel
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .on('mousedown', currentStartCallback)
        .on('touchend', currentStartCallback);
      const currentLevelText = new PIXI.Text(`level ${i + 1}`, {
        fill: '#fff',
        fontSize: 20,
        fontWeight: '500',
      });
      currentLevelText.x = startingCol + spacing * Math.floor(i % 4);
      currentLevelText.y = startingRow + spacing * Math.floor(i / 4);
      currentLevelText.anchor.set(0.5);

      self.soloLevels.push(currentLevel);
      self.soloLevels.push(currentLevelText);
      self.addChild(currentLevel);
      self.addChild(currentLevelText);
    }
  };

  getUser(id, createLevels);
};

Menu.prototype._createSoloPage = function () {
  const backCallback = function () {
    this._removeSoloPage();
    this._createSinglePage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  // player level
  this.playerLevelText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.2,
    `Player level: ${this.userInfo.level || 1}`,
    { fill: '#fff', fontSize: 25 }
  );
  this.addChild(this.playerLevelText);

  this.__createSoloLevels();
};

Menu.prototype._removeSoloPage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.playerLevelText);
  for (const soloLevels of this.soloLevels) {
    this.removeChild(soloLevels);
  }
};
