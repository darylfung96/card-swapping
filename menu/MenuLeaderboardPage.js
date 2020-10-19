//========================= leaderboard =========================//

//------------------------- most played -------------------------//
Menu.prototype._listMostPlayed = function (data) {
  if (!data.success) {
    console.error('error obtaining most played leaderboard data');
    return;
  }
  // if most played already listed, we don't have to do anything here
  if (this.mostPlayedChildren) return;

  // remove list of high score if applicable
  this._removeHighScores();

  this.mostPlayedChildren = [];

  this.mostPlayedLeaderboard = data.leaderboard;

  const mostPlayedLeftX = this.screenWidth * 0.2;
  const mostPlayedRightX = this.screenWidth * 0.8;
  const mostPlayedStartY = this.screenHeight * 0.3;
  const spacingY = this.screenHeight * 0.05;

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
  this.addChild(this.playerIdText);
  this.addChild(this.mostPlayedTitleText);
  this.mostPlayedChildren.push(this.playerIdText);
  this.mostPlayedChildren.push(this.mostPlayedTitleText);

  const mostPlayedKeys = Object.keys(this.mostPlayedLeaderboard);
  for (let i = 0; i < mostPlayedKeys.length; i++) {
    const currentPlayer = ButtonFactoryText(
      mostPlayedLeftX,
      mostPlayedStartY + spacingY * (i + 1),
      mostPlayedKeys[i],
      { fill: '#fff', fontSize: 25 }
    );
    const currentPlayerPlayed = ButtonFactoryText(
      mostPlayedRightX,
      mostPlayedStartY + spacingY * (i + 1),
      this.mostPlayedLeaderboard[mostPlayedKeys[i]],
      { fill: '#fff', fontSize: 25 }
    );

    this.addChild(currentPlayer);
    this.addChild(currentPlayerPlayed);
    this.mostPlayedChildren.push(currentPlayer);
    this.mostPlayedChildren.push(currentPlayerPlayed);
  }
};
Menu.prototype._removeMostPlayed = function () {
  if (!this.mostPlayedChildren) return;

  for (const child of this.mostPlayedChildren) {
    this.removeChild(child);
  }

  this.mostPlayedChildren = null;
};

Menu.prototype._listHighScores = function (data) {
  if (!data.success) {
    console.error('error obtaining most played leaderboard data');
    return;
  }
  // if high score is already listen, then we don't have to do anything here
  if (this.highScoreChildren) return;

  // remove list of most played if applicable
  this._removeMostPlayed();

  this.highScoreChildren = [];

  this.highScoreLeaderboard = data.leaderboard;

  const highScoreLeftX = this.screenWidth * 0.2;
  const highScoreMiddleX = this.screenWidth * 0.5;
  const highScoreRightX = this.screenWidth * 0.8;
  const highScoreStartY = this.screenHeight * 0.3;
  const spacingY = this.screenHeight * 0.05;

  this.playerIdText = ButtonFactoryText(
    highScoreLeftX,
    highScoreStartY,
    'Player ID',
    { fill: '#fff', fontSize: 25 }
  );
  this.levelText = ButtonFactoryText(
    highScoreMiddleX,
    highScoreStartY,
    'Level',
    { fill: '#fff', fontSize: 25 }
  );
  this.highScoreTitleText = ButtonFactoryText(
    highScoreRightX,
    highScoreStartY,
    'Score',
    { fill: '#fff', fontSize: 25 }
  );
  this.addChild(this.playerIdText);
  this.addChild(this.levelText);
  this.addChild(this.highScoreTitleText);
  this.highScoreChildren.push(this.playerIdText);
  this.highScoreChildren.push(this.levelText);
  this.highScoreChildren.push(this.highScoreTitleText);

  const highScoreKeys = Object.keys(this.highScoreLeaderboard);
  let currentItem = 1;
  for (let i = highScoreKeys.length - 1; i >= 0; i--) {
    const currentLevel = highScoreKeys[i];
    const users = Object.keys(this.highScoreLeaderboard[currentLevel]);
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
      const score = this.highScoreLeaderboard[currentLevel][user];

      const userText = ButtonFactoryText(
        highScoreLeftX,
        highScoreStartY + spacingY * currentItem,
        user,
        { fill: '#fff', fontSize: 25 }
      );
      const levelText = ButtonFactoryText(
        highScoreMiddleX,
        highScoreStartY + spacingY * currentItem,
        currentLevel,
        { fill: '#fff', fontSize: 25 }
      );
      const scoreText = ButtonFactoryText(
        highScoreRightX,
        highScoreStartY + spacingY * currentItem,
        score,
        { fill: '#fff', fontSize: 25 }
      );

      this.addChild(userText);
      this.addChild(levelText);
      this.addChild(scoreText);
      this.highScoreChildren.push(userText);
      this.highScoreChildren.push(levelText);
      this.highScoreChildren.push(scoreText);

      currentItem++;
    }
  }
};
Menu.prototype._removeHighScores = function () {
  if (!this.highScoreChildren) return;

  for (const child of this.highScoreChildren) {
    this.removeChild(child);
  }

  this.highScoreChildren = null;
};

Menu.prototype._createLeaderboardPage = function () {
  // create back button
  const backButton = function () {
    this._removeLeaderboardPage();
    this._createMainPage();
  };
  this.backButton = this.__createBackButton(backButton.bind(this));
  this.addChild(this.backButton);

  // create tabs
  const mostPlayedClickCallback = function () {
    this.mostPlayedText.style = {
      ...this.mostPlayedText.style,
      fontWeight: '600',
    };
    this.highestScoreText.style = {
      ...this.highestScoreText.style,
      fontWeight: '500',
    };
    getLeaderboard('timesPlayed', this._listMostPlayed.bind(this));
  };
  this.mostPlayedText = ButtonFactoryText(
    this.screenWidth * 0.35,
    this.screenHeight * 0.2,
    'Most Played',
    { fill: '#fff', fontSize: 25, fontWeight: '600' },
    mostPlayedClickCallback.bind(this)
  );
  this.addChild(this.mostPlayedText);

  const highScoreClickCallback = function () {
    this.mostPlayedText.style = {
      ...this.mostPlayedText.style,
      fontWeight: '500',
    };
    this.highestScoreText.style = {
      ...this.highestScoreText.style,
      fontWeight: '600',
    };
    getLeaderboard('highScore', this._listHighScores.bind(this));
  };
  this.highestScoreText = ButtonFactoryText(
    this.screenWidth * 0.65,
    this.screenHeight * 0.2,
    'Highest Score',
    { fill: '#fff', fontSize: 25, fontWeight: '500' },
    highScoreClickCallback.bind(this)
  );
  this.addChild(this.highestScoreText);

  // query for leaderboard
  getLeaderboard('timesPlayed', this._listMostPlayed.bind(this));
};

Menu.prototype._removeLeaderboardPage = function () {
  this.removeChild(this.backButton);
  this.removeChild(this.mostPlayedText);
  this.removeChild(this.highestScoreText);
  this._removeMostPlayed();
  this._removeHighScores();
};
