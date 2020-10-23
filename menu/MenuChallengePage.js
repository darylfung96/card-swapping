//========================= challenge player page =========================//

Menu.prototype._createReceiveChallengePage = function () {};

Menu.prototype.__processPlayersToList = function (filteredPlayers) {
  this.allPlayersPerPage = [];
  const totalPages = Math.ceil(filteredPlayers.length / MAX_ITEM_PER_PAGE);
  for (let currentPage = 0; currentPage < totalPages; currentPage++) {
    this.allPlayersPerPage.push([]);
    for (let j = 0; j < MAX_ITEM_PER_PAGE; j++) {
      if (currentPage * MAX_ITEM_PER_PAGE + j >= filteredPlayers.length) break;
      this.allPlayersPerPage[currentPage].push(
        filteredPlayers[currentPage * MAX_ITEM_PER_PAGE + j]
      );
    }
  }
  this.currentPage = 0;
  this._listSendChallengePlayers(this.currentPage);
};

Menu.prototype._listSendChallengePlayers = function (pageIndex) {
  // remove existing children;
  if (this.allPlayersPerPageChildren) {
    for (const child of this.allPlayersPerPageChildren) {
      this.removeChild(child);
    }
    this.removeChild(this.prevButton);
    this.removeChild(this.nextButton);
  }
  // don't list any players if no players are found
  if (this.allPlayersPerPage.length === 0) return;

  this.allPlayersPerPageChildren = [];
  const leftX = this.screenWidth * 0.2;
  const middleX = this.screenWidth * 0.5;
  const rightX = this.screenWidth * 0.8;
  const startingY = this.screenHeight * 0.4;
  const spacingY = this.screenHeight * 0.1;

  this.playerNameTitle = ButtonFactoryText(
    leftX,
    startingY + spacingY * -1,
    'Player ID',
    {
      fill: '#fff',
      fontSize: 25,
    }
  );
  this.levelTitle = ButtonFactoryText(
    middleX,
    startingY + spacingY * -1,
    'Player Level',
    {
      fill: '#fff',
      fontSize: 25,
    }
  );
  this.addChild(this.playerNameTitle);
  this.addChild(this.levelTitle);
  this.allPlayersPerPageChildren.push(this.playerNameTitle);
  this.allPlayersPerPageChildren.push(this.levelTitle);
  for (let i = 0; i < this.allPlayersPerPage[pageIndex].length; i++) {
    const currentPlayer = Object.keys(this.allPlayersPerPage[pageIndex][i])[0];
    const currentPlayerLevel = Object.values(
      this.allPlayersPerPage[pageIndex][i]
    )[0];

    const currentPlayerText = ButtonFactoryText(
      leftX,
      startingY + spacingY * i,
      currentPlayer,
      {
        fill: '#fff',
        fontSize: 25,
      }
    );
    const currentPlayerLevelText = ButtonFactoryText(
      middleX,
      startingY + spacingY * i,
      currentPlayerLevel,
      {
        fill: '#fff',
        fontSize: 25,
      }
    );
    const challengeCallback = function () {
      const difficulty = this.userInfo.level;
      this.startGameCallback(difficulty, this.userInfo, true, currentPlayer);
    };
    const challengeButton = ButtonFactory(
      rightX,
      startingY + spacingY * i,
      this.screenWidth * 0.21,
      this.screenHeight * 0.07,
      'resources/buttons/button_challenge.png',
      challengeCallback.bind(this)
    );
    this.allPlayersPerPageChildren.push(currentPlayerText);
    this.addChild(currentPlayerText);
    this.allPlayersPerPageChildren.push(currentPlayerLevelText);
    this.addChild(currentPlayerLevelText);
    this.allPlayersPerPageChildren.push(challengeButton);
    this.addChild(challengeButton);
  }

  // add prev / next button
  if (pageIndex > 0) {
    this.prevButton = ButtonFactoryText(
      this.screenWidth * 0.2,
      this.screenHeight * 0.9,
      'Previous',
      { fill: '#fff', fontSize: 25 },
      () => {
        this._listSendChallengePlayers(pageIndex - 1);
      }
    );
    this.addChild(this.prevButton);
  }
  if (pageIndex < this.allPlayersPerPage.length - 1) {
    this.nextButton = ButtonFactoryText(
      this.screenWidth * 0.8,
      this.screenHeight * 0.9,
      'Next',
      { fill: '#fff', fontSize: 25 },
      () => {
        this._listSendChallengePlayers(pageIndex + 1);
      }
    );
    this.addChild(this.nextButton);
  }
};
Menu.prototype._createSendChallengePage = function () {
  const backCallback = function () {
    this._removeSendChallengePage();
    this._createChallengePage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  const searchInputCallback = function (text) {
    const filteredPlayers = this.allPlayers.filter((player) => {
      return Object.keys(player)[0].indexOf(text) !== -1;
    });
    this.__processPlayersToList(filteredPlayers);
  };
  this.searchInput = new PIXI.TextInput({
    input: {
      fontSize: '25px',
      padding: '12px',
      height: `${this.screenHeight * 0.05}px`,
      width: `${this.screenWidth * 0.4}px`,
      color: '#26272E',
    },
    box: {
      default: {
        fill: 0xe8e9f3,
        rounded: 12,
        stroke: { color: 0xcbcee0, width: 3 },
      },
      focused: {
        fill: 0xe1e3ee,
        rounded: 12,
        stroke: { color: 0xabafc6, width: 3 },
      },
      disabled: { fill: 0xdbdbdb, rounded: 12 },
    },
  });
  this.searchInput.placeholder = 'Search for player ID';
  this.searchInput.x = this.screenWidth * 0.5;
  this.searchInput.y = this.screenHeight * 0.2;
  this.searchInput.pivot.x = this.searchInput.width / 2;
  this.searchInput.pivot.y = this.searchInput.height / 2;
  this.addChild(this.searchInput);
  this.searchInput.on('input', searchInputCallback.bind(this));

  const MAX_ITEM_PER_PAGE = 5;

  const getPlayers = function (data) {
    if (!data.success) console.error('error retrieving players');
    this.allPlayers = data.allPlayers.filter(
      (player) => Object.keys(player)[0] !== this.userInfo.id
    );
    this.__processPlayersToList(this.allPlayers);
  };
  getUsers(getPlayers.bind(this));
};

Menu.prototype._removeSendChallengePage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.prevButton);
  this.removeChild(this.nextButton);
  this.removeChild(this.searchInput);

  // remove existing children;
  if (this.allPlayersPerPageChildren) {
    for (const child of this.allPlayersPerPageChildren) {
      this.removeChild(child);
    }
  }
};

Menu.prototype._createChallengePage = function () {
  const backCallback = function () {
    this._removeChallengePage();
    this._createPlayPage();
  };
  this.backButton = this.__createBackButton(backCallback.bind(this));
  this.addChild(this.backButton);

  // receive challenge
  const receiveChallengeCallback = function () {};
  this.receiveChallengeText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.4,
    'Challenge Received',
    { fill: '#fff', fontSize: 30 },
    receiveChallengeCallback.bind(this)
  );
  this.addChild(this.receiveChallengeText);

  // send challenge
  const sendChallengeCallback = function () {
    this._removeChallengePage();
    this._createSendChallengePage();
  };
  this.sendChallengeText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Send Challenge',
    { fill: '#fff', fontSize: 30 },
    sendChallengeCallback.bind(this)
  );
  this.addChild(this.sendChallengeText);
};

Menu.prototype._removeChallengePage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.receiveChallengeText);
  this.removeChild(this.sendChallengeText);
};
