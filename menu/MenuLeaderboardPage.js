//========================= leaderboard =========================//
const MAX_ITEM_PER_PAGE = 5;
//todo make winningRate leaderboard

//------------------------- most played -------------------------//
Menu.prototype._getMostPlayed = function (data) {
  if (!data.success) {
    console.error('error obtaining most played leaderboard data');
    return;
  }
  // if already queried the leaderboard then we just list them instead of processing them
  if (this.processedMostPlayedLeaderboard) {
    this.currentPage = 0;
    this._listMostPlayed(this.currentPage);
    return;
  }

  // create list of player keys, so we can have pages (page 1, page 2) in case if there are too many players
  this.processedMostPlayedLeaderboard = []; // [[1,2,3,4,5], [6,7,8,9,10], ...], based on MAX_ITEM_PER_PAGE=5
  const playerKeys = Object.keys(data.leaderboard);

  const totalPages = Math.ceil(playerKeys.length / MAX_ITEM_PER_PAGE);
  for (let i = 0; i < totalPages; i++) {
    this.processedMostPlayedLeaderboard.push([]);
    for (let j = 0; j < MAX_ITEM_PER_PAGE; j++) {
      // if over the total length then we break out
      if (i * MAX_ITEM_PER_PAGE + j >= playerKeys.length) break;

      const currentPlayer = playerKeys[i * MAX_ITEM_PER_PAGE + j];
      this.processedMostPlayedLeaderboard[i].push({
        [currentPlayer]: data.leaderboard[currentPlayer],
      });
    }
  }
  // list most played after getting them
  this.currentPage = 0;
  this._listMostPlayed(this.currentPage);
};
Menu.prototype._listMostPlayed = function (pageIndex) {
  // if most played already listed, we don't have to do anything here
  if (this.mostPlayedChildren) return;

  // remove list of highest level if applicable
  this._removeHighestLevel();
  this._removeWinningRate();

  this.mostPlayedChildren = [];

  const rankX = this.screenWidth * 0.1;
  const mostPlayedLeftX = this.screenWidth * 0.3;
  const mostPlayedRightX = this.screenWidth * 0.8;
  const mostPlayedStartY = this.screenHeight * 0.3;
  const spacingY = this.screenHeight * 0.05;

  // list the children
  this.rankText = ButtonFactoryText(rankX, mostPlayedStartY, 'Rank', {
    fill: '#fff',
    fontSize: 25,
  });
  this.playerIdText = ButtonFactoryText(
    mostPlayedLeftX,
    mostPlayedStartY,
    'Player ID',
    { fill: '#fff', fontSize: 25 }
  );
  this.mostPlayedTitleText = ButtonFactoryText(
    mostPlayedRightX,
    mostPlayedStartY,
    'Times Played',
    { fill: '#fff', fontSize: 25 }
  );
  this.addChild(this.rankText);
  this.addChild(this.playerIdText);
  this.addChild(this.mostPlayedTitleText);
  this.mostPlayedChildren.push(this.rankText);
  this.mostPlayedChildren.push(this.playerIdText);
  this.mostPlayedChildren.push(this.mostPlayedTitleText);

  // don't list anything if empty
  if (this.processedMostPlayedLeaderboard.length === 0) {
    return;
  }

  for (
    let i = 0;
    i < this.processedMostPlayedLeaderboard[pageIndex].length;
    i++
  ) {
    const rank = ButtonFactoryText(
      rankX,
      mostPlayedStartY + spacingY * (i + 1),
      pageIndex * MAX_ITEM_PER_PAGE + i + 1,
      { fill: '#fff', fontSize: 25 }
    );
    let currentPlayerName = Object.keys(
      this.processedMostPlayedLeaderboard[pageIndex][i]
    )[0];
    if (currentPlayerName.includes('unknown'))
      currentPlayerName = currentPlayerName.substring(2);
    const currentPlayer = ButtonFactoryText(
      mostPlayedLeftX,
      mostPlayedStartY + spacingY * (i + 1),
      currentPlayerName,
      { fill: '#fff', fontSize: 25 }
    );
    const currentPlayerPlayed = ButtonFactoryText(
      mostPlayedRightX,
      mostPlayedStartY + spacingY * (i + 1),
      Object.values(this.processedMostPlayedLeaderboard[pageIndex][i])[0],
      { fill: '#fff', fontSize: 25 }
    );

    this.addChild(rank);
    this.addChild(currentPlayer);
    this.addChild(currentPlayerPlayed);
    this.mostPlayedChildren.push(rank);
    this.mostPlayedChildren.push(currentPlayer);
    this.mostPlayedChildren.push(currentPlayerPlayed);
  }

  // list the button for previous page
  const prevButtonCallback = function () {
    this._removeMostPlayed();
    this._listMostPlayed(pageIndex - 1);
  };
  if (pageIndex > 0) {
    this.prevButton = ButtonFactoryText(
      rankX,
      this.screenHeight * 0.7,
      'Previous',
      { fill: '#fff', fontSize: 25 },
      prevButtonCallback.bind(this)
    );
    this.addChild(this.prevButton);
  }

  // list the button for next page
  const nextButtonCallback = function () {
    this._removeMostPlayed();
    this._listMostPlayed(pageIndex + 1);
  };
  if (pageIndex < this.processedMostPlayedLeaderboard.length - 1) {
    this.nextButton = ButtonFactoryText(
      mostPlayedRightX,
      this.screenHeight * 0.7,
      'Next',
      { fill: '#fff', fontSize: 25 },
      nextButtonCallback.bind(this)
    );
    this.addChild(this.nextButton);
  }
};
Menu.prototype._removeMostPlayed = function () {
  if (!this.mostPlayedChildren) return;

  for (const child of this.mostPlayedChildren) {
    this.removeChild(child);
  }

  this.removeChild(this.prevButton);
  this.removeChild(this.nextButton);

  this.mostPlayedChildren = null;
};

//------------------------- winning rate -------------------------//
Menu.prototype._getWinningRate = function (data) {
  if (!data.success) {
    console.error('error getting winning rate from leaderboard');
    return;
  }

  // if already queried in the leaderboard then we just list them
  if (this.processedWinningRateLeaderboard) {
    this.currentPage = 0;
    this._listWinningRate(this.currentPage);
    return;
  }

  this.processedWinningRateLeaderboard = [];
  const playerKeys = Object.keys(data.leaderboard);

  const totalPages = Math.ceil(playerKeys.length / MAX_ITEM_PER_PAGE);
  for (let i = 0; i < totalPages; i++) {
    this.processedWinningRateLeaderboard.push([]);
    for (let j = 0; j < MAX_ITEM_PER_PAGE; j++) {
      // if over the total length then we break out
      if (i * MAX_ITEM_PER_PAGE + j >= playerKeys.length) break;

      const currentPlayer = playerKeys[i * MAX_ITEM_PER_PAGE + j];
      this.processedWinningRateLeaderboard[i].push({
        [currentPlayer]: data.leaderboard[currentPlayer],
      });
    }
  }
  console.log(this.processedWinningRateLeaderboard);
  // list most played after getting them
  this.currentPage = 0;
  this._listWinningRate(this.currentPage);
};
Menu.prototype._listWinningRate = function (pageIndex) {
  // if most played already listed, we don't have to do anything here
  if (this.winningRateChildren) return;

  // remove list of highest level if applicable
  this._removeHighestLevel();
  this._removeMostPlayed();

  this.winningRateChildren = [];

  const rankX = this.screenWidth * 0.1;
  const winningRateLeftX = this.screenWidth * 0.3;
  const winningRateRightX = this.screenWidth * 0.8;
  const winningRateStartY = this.screenHeight * 0.3;
  const spacingY = this.screenHeight * 0.05;

  // list the children
  this.rankText = ButtonFactoryText(rankX, winningRateStartY, 'Rank', {
    fill: '#fff',
    fontSize: 25,
  });
  this.playerIdText = ButtonFactoryText(
    winningRateLeftX,
    winningRateStartY,
    'Player ID',
    { fill: '#fff', fontSize: 25 }
  );
  this.winningRateTitleText = ButtonFactoryText(
    winningRateRightX,
    winningRateStartY,
    'Winning Rate',
    { fill: '#fff', fontSize: 25 }
  );
  this.addChild(this.rankText);
  this.addChild(this.playerIdText);
  this.addChild(this.winningRateTitleText);
  this.winningRateChildren.push(this.rankText);
  this.winningRateChildren.push(this.playerIdText);
  this.winningRateChildren.push(this.winningRateTitleText);

  // don't list anything if empty
  if (this.processedWinningRateLeaderboard.length === 0) {
    return;
  }

  for (
    let i = 0;
    i < this.processedWinningRateLeaderboard[pageIndex].length;
    i++
  ) {
    const rank = ButtonFactoryText(
      rankX,
      winningRateStartY + spacingY * (i + 1),
      pageIndex * MAX_ITEM_PER_PAGE + i + 1,
      { fill: '#fff', fontSize: 25 }
    );
    let currentPlayerName = Object.keys(
      this.processedWinningRateLeaderboard[pageIndex][i]
    )[0];
    if (currentPlayerName.includes('unknown'))
      currentPlayerName = currentPlayerName.substring(2);
    const currentPlayer = ButtonFactoryText(
      winningRateLeftX,
      winningRateStartY + spacingY * (i + 1),
      currentPlayerName,
      { fill: '#fff', fontSize: 25 }
    );
    const currentPlayerWinningRate = ButtonFactoryText(
      winningRateRightX,
      winningRateStartY + spacingY * (i + 1),
      Object.values(this.processedWinningRateLeaderboard[pageIndex][i])[0] *
        100 +
        '%',
      { fill: '#fff', fontSize: 25 }
    );

    this.addChild(rank);
    this.addChild(currentPlayer);
    this.addChild(currentPlayerWinningRate);
    this.winningRateChildren.push(rank);
    this.winningRateChildren.push(currentPlayer);
    this.winningRateChildren.push(currentPlayerWinningRate);
  }

  // list the button for previous page
  const prevButtonCallback = function () {
    this._removeWinningRate();
    this._listWinningRate(pageIndex - 1);
  };
  if (pageIndex > 0) {
    this.prevButton = ButtonFactoryText(
      rankX,
      this.screenHeight * 0.7,
      'Previous',
      { fill: '#fff', fontSize: 25 },
      prevButtonCallback.bind(this)
    );
    this.addChild(this.prevButton);
  }

  // list the button for next page
  const nextButtonCallback = function () {
    this._removeWinningRate();
    this._listWinningRate(pageIndex + 1);
  };
  if (pageIndex < this.processedWinningRateLeaderboard.length - 1) {
    this.nextButton = ButtonFactoryText(
      winningRateRightX,
      this.screenHeight * 0.7,
      'Next',
      { fill: '#fff', fontSize: 25 },
      nextButtonCallback.bind(this)
    );
    this.addChild(this.nextButton);
  }
};
Menu.prototype._removeWinningRate = function () {
  if (!this.winningRateChildren) return;

  for (const child of this.winningRateChildren) {
    this.removeChild(child);
  }

  this.removeChild(this.prevButton);
  this.removeChild(this.nextButton);

  this.winningRateChildren = null;
};

//------------------------- highest level -------------------------//
Menu.prototype._getHighestLevel = function (data) {
  if (!data.success) {
    console.error('error obtaining most played leaderboard data');
    return;
  }
  this.currentPage = 0;
  // if there is already highest level queried then we just return them instead of re-processing them
  if (this.processedHighestLevelLeaderboard) {
    this._listHighestLevel(this.currentPage);
    return;
  }

  this.processedHighestLevelLeaderboard = [];
  const playerKeys = Object.keys(data.leaderboard);
  const totalPages = Math.ceil(playerKeys.length / MAX_ITEM_PER_PAGE);
  for (let i = 0; i < totalPages; i++) {
    this.processedHighestLevelLeaderboard.push([]);
    for (let j = 0; j < MAX_ITEM_PER_PAGE; j++) {
      // if over the total length we get out of the loop
      if (i * MAX_ITEM_PER_PAGE + j > playerKeys.length - 1) break;

      const currentPlayer = playerKeys[i * MAX_ITEM_PER_PAGE + j];
      const level = data.leaderboard[currentPlayer];
      this.processedHighestLevelLeaderboard[i].push({ [currentPlayer]: level });
    }
  }

  this._listHighestLevel(this.currentPage);
};
Menu.prototype._listHighestLevel = function (pageIndex) {
  // if highest level is already listed, then we don't have to do anything here
  if (this.highestLevelChildren) return;

  // remove list of most played if applicable
  this._removeMostPlayed();
  this._removeWinningRate();

  this.highestLevelChildren = [];

  const rankX = this.screenWidth * 0.1;
  const highestLevelLeftX = this.screenWidth * 0.3;
  const highestLevelRightX = this.screenWidth * 0.8;
  const highestLevelStartY = this.screenHeight * 0.3;
  const spacingY = this.screenHeight * 0.05;

  this.rankText = ButtonFactoryText(rankX, highestLevelStartY, 'Rank', {
    fill: '#fff',
    fontSize: 25,
  });
  this.playerIdText = ButtonFactoryText(
    highestLevelLeftX,
    highestLevelStartY,
    'Player ID',
    { fill: '#fff', fontSize: 25 }
  );
  this.levelText = ButtonFactoryText(
    highestLevelRightX,
    highestLevelStartY,
    'Level',
    { fill: '#fff', fontSize: 25 }
  );

  this.addChild(this.rankText);
  this.addChild(this.playerIdText);
  this.addChild(this.levelText);
  this.highestLevelChildren.push(this.rankText);
  this.highestLevelChildren.push(this.playerIdText);
  this.highestLevelChildren.push(this.levelText);

  for (
    let currentPage = 0;
    currentPage < this.processedHighestLevelLeaderboard.length;
    currentPage++
  ) {
    for (
      let currentIndex = 0;
      currentIndex < this.processedHighestLevelLeaderboard[currentPage].length;
      currentIndex++
    ) {
      let currentPlayer = Object.keys(
        this.processedHighestLevelLeaderboard[currentPage][currentIndex]
      )[0];
      const level = this.processedHighestLevelLeaderboard[currentPage][
        currentIndex
      ][currentPlayer];
      const rank = currentPage * MAX_ITEM_PER_PAGE + currentIndex + 1;
      if (currentPlayer.includes('unknown'))
        currentPlayer = currentPlayer.substring(2);

      const rankText = ButtonFactoryText(
        rankX,
        highestLevelStartY + spacingY * (currentIndex + 1),
        rank,
        { fill: '#fff', fontSize: 25 }
      );
      const playerText = ButtonFactoryText(
        highestLevelLeftX,
        highestLevelStartY + spacingY * (currentIndex + 1),
        currentPlayer,
        { fill: '#fff', fontSize: 25 }
      );
      const levelText = ButtonFactoryText(
        highestLevelRightX,
        highestLevelStartY + spacingY * (currentIndex + 1),
        level,
        { fill: '#fff', fontSize: 25 }
      );

      this.addChild(rankText);
      this.addChild(playerText);
      this.addChild(levelText);
      this.highestLevelChildren.push(rankText);
      this.highestLevelChildren.push(playerText);
      this.highestLevelChildren.push(levelText);
    }
  }

  // list the button for previous page
  const prevButtonCallback = function () {
    this._removeHighestLevel();
    this._listHighestLevel(pageIndex - 1);
  };
  if (pageIndex > 0) {
    this.prevButton = ButtonFactoryText(
      rankX,
      this.screenHeight * 0.7,
      'Previous',
      { fill: '#fff', fontSize: 25 },
      prevButtonCallback.bind(this)
    );
    this.addChild(this.prevButton);
  }

  // list the button for next page
  const nextButtonCallback = function () {
    this._removeHighestLevel();
    this._listHighestLevel(pageIndex + 1);
  };
  if (pageIndex < this.processedHighestLevelLeaderboard.length - 1) {
    this.nextButton = ButtonFactoryText(
      mostPlayedRightX,
      this.screenHeight * 0.7,
      'Next',
      { fill: '#fff', fontSize: 25 },
      nextButtonCallback.bind(this)
    );
    this.addChild(this.nextButton);
  }
};
Menu.prototype._removeHighestLevel = function () {
  if (!this.highestLevelChildren) return;

  for (const child of this.highestLevelChildren) {
    this.removeChild(child);
  }

  this.removeChild(this.prevButton);
  this.removeChild(this.nextButton);

  this.highestLevelChildren = null;
};

//------------------------- initialization -------------------------//

Menu.prototype._createLeaderboardPage = function () {
  // create back button
  const backButton = function () {
    this._removeLeaderboardPage();
    this._createMainPage();
  };
  this.backButton = this.__createBackButton(backButton.bind(this));
  this.addChild(this.backButton);

  // create tabs
  // most played
  const mostPlayedClickCallback = function () {
    this.mostPlayedText.style = {
      ...this.mostPlayedText.style,
      fontWeight: '600',
    };
    this.winningRateText.style = {
      ...this.winningRateText.style,
      fontWeight: '500',
    };
    this.highestLevelText.style = {
      ...this.highestLevelText.style,
      fontWeight: '500',
    };
    getLeaderboard('timesPlayed', this._getMostPlayed.bind(this));
  };
  this.mostPlayedText = ButtonFactoryText(
    this.screenWidth * 0.15,
    this.screenHeight * 0.2,
    'Most Played',
    { fill: '#fff', fontSize: 25, fontWeight: '600' },
    mostPlayedClickCallback.bind(this)
  );
  this.addChild(this.mostPlayedText);

  // winning rate
  const winningRateClickCallback = function () {
    this.mostPlayedText.style = {
      ...this.mostPlayedText.style,
      fontWeight: '500',
    };
    this.winningRateText.style = {
      ...this.winningRateText.style,
      fontWeight: '600',
    };
    this.highestLevelText.style = {
      ...this.highestLevelText.style,
      fontWeight: '500',
    };
    getLeaderboard('winningRate', this._getWinningRate.bind(this));
  };
  this.winningRateText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.2,
    'Winning Rate',
    { fill: '#fff', fontSize: 25, fontWeight: '500' },
    winningRateClickCallback.bind(this)
  );
  this.addChild(this.winningRateText);

  // highest level
  const highestLevelClickCallback = function () {
    this.mostPlayedText.style = {
      ...this.mostPlayedText.style,
      fontWeight: '500',
    };
    this.winningRateText.style = {
      ...this.winningRateText.style,
      fontWeight: '500',
    };
    this.highestLevelText.style = {
      ...this.highestLevelText.style,
      fontWeight: '600',
    };
    getLeaderboard('highestLevel', this._getHighestLevel.bind(this));
  };
  this.highestLevelText = ButtonFactoryText(
    this.screenWidth * 0.85,
    this.screenHeight * 0.2,
    'Highest Level',
    { fill: '#fff', fontSize: 25, fontWeight: '500' },
    highestLevelClickCallback.bind(this)
  );
  this.addChild(this.highestLevelText);

  // query for leaderboard
  getLeaderboard('timesPlayed', this._getMostPlayed.bind(this));
};

Menu.prototype._removeLeaderboardPage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.mostPlayedText);
  this.removeChild(this.highestLevelText);
  this.removeChild(this.winningRateText);

  // remove the queried items
  this.processedMostPlayedLeaderboard = null;
  this.processedWinningRateLeaderboard = null;
  this.processedHighestLevelLeaderboard = null;

  this._removeMostPlayed();
  this._removeHighestLevel();
  this._removeWinningRate();
};
