//========================= challenge player page =========================//

Menu.prototype._createReceiveChallengePage = function () {};

Menu.prototype._listSendChallengePlayers = function (pageIndex) {
  // remove existing children;
  if (this.allPlayersPerPageChildren) {
    for (const child of this.allPlayersPerPageChildren) {
      this.removeChild(child);
    }
    this.removeChild(this.prevButton);
    this.removeChild(this.nextButton);
  }
  this.allPlayersPerPageChildren = [];
  const leftX = this.screenWidth * 0.2;
  const middleX = this.screenWidth * 0.5;
  const rightX = this.screenWidth * 0.8;
  const startingY = this.screenHeight * 0.3;
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
    const challengeButton = ButtonFactory(
      rightX,
      startingY + spacingY * i,
      this.screenWidth * 0.21,
      this.screenHeight * 0.07,
      'resources/buttons/button_challenge.png'
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
      this.screenHeight * 0.8,
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
      this.screenHeight * 0.8,
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

  const MAX_ITEM_PER_PAGE = 5;

  const getPlayers = function (data) {
    if (!data.success) console.error('error retrieving players');
    const allPlayers = data.allPlayers;
    this.allPlayersPerPage = [];
    const totalPages = Math.ceil(allPlayers.length / MAX_ITEM_PER_PAGE);
    for (let currentPage = 0; currentPage < totalPages; currentPage++) {
      this.allPlayersPerPage.push([]);
      for (let j = 0; j < MAX_ITEM_PER_PAGE; j++) {
        if (currentPage * MAX_ITEM_PER_PAGE + j >= allPlayers.length) break;
        this.allPlayersPerPage[currentPage].push(
          allPlayers[currentPage * MAX_ITEM_PER_PAGE + j]
        );
      }
    }
    this.currentPage = 0;
    this._listSendChallengePlayers(this.currentPage);
  };
  getUsers(getPlayers.bind(this));
};

Menu.prototype._removeSendChallengePage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.prevButton);
  this.removeChild(this.nextButton);

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
