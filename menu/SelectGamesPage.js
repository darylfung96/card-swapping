var MAX_COL = 3;
/*
  This class will render the items for the selecting games page. 
  It will also handle rendering of specific games page.
  The gamesReRenderCallback will call the MenuContainer to re-render the items in the select
  games page.

  screenWidth:                          the width of the game canvas
  screenHeight:                         the height of the game canvas
  homeMenuCallback:                     the callback to change the children of the MenuContainer to render the 
                                        home menu where it shows the select games button. This callback goes back to the main home page.
  gamesReRenderCallback:                The callback to re-render the children of SelectGamesPage when navigating to different types
                                        of games or the select games page.
  changeContainerCallback:              the callback to change the rendering container from the Main.js to switch to rendering playing
                                        games.
*/
function SelectGamesPage(
  screenWidth,
  screenHeight,
  homeMenuCallback,
  gamesReRenderCallback,
  changeMainContainerCallback
) {
  this.currentGames = [
    {
      name: 'speedy',
      sprite: 'resources/buttons/Menu/selectGames/speedy.png',
      page: new GamePage(
        screenWidth,
        screenHeight,
        'resources/buttons/Menu/selectGames/speedy.png',
        descriptionText(
          'Speedy is a game to test your speed and flexibility. You will be shown ' +
            'with a page with shapes and you have to determine if the next page contains the same number ' +
            'of shapes as the previous page regardless of the type of shapes. You just have to determine of they have the same number of items/shapes.' +
            'If the next page contains the same number of shapes as the ' +
            'previous page, press the RIGHT key. If the next page does not contains the same number of shapes ' +
            'as the previous page, then press the LEFT key. The game will end in 1 minute. Try your best to get as many of them correct.',
          80
        )
      ),
    },
  ];

  this.children = [];

  this.changeMainContainerCallback = changeMainContainerCallback;

  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;

  this.homeMenuCallback = homeMenuCallback;
  this.gamesReRenderCallback = gamesReRenderCallback; // triggers re-rendering of the children of SelectGamesPage

  // listings
  this.current_col = 0;
  this.current_row = 0;
  this.startX = this.screenWidth / 4;
  this.startY = this.screenHeight / 3;
  this.xSpacing = this.screenWidth / 5;
  this.ySpacing = this.screenHeight / 4;

  // create a button once get into game types, can go back to select games page
  // this is to be used in each game type page, so we can go back to the select games page
  this._createBackToSelectGamesButton();

  // initialize the select games page
  this._initialize();
}

SelectGamesPage.prototype._createBackToHomeButton = function () {
  var text = 'Back';
  var textStyle = {
    fill: '#ffffff',
    fontSize: 20,
    align: 'center',
  };
  var x = this.screenWidth / 8;
  var y = this.screenHeight / 15;

  this.backText = ButtonFactoryText(
    x,
    y,
    text,
    textStyle,
    this.homeMenuCallback
  );
  this.children.push(this.backText);
};

// this function creates the back to select games page for the games pages.
// the button created will be passed into the games page so when user click on the back button
// in the games pages, they will be returned to the select games page.
SelectGamesPage.prototype._createBackToSelectGamesButton = function () {
  var text = 'Back';
  var textStyle = {
    fill: '#ffffff',
    fontSize: 20,
    align: 'center',
  };
  var x = this.screenWidth / 8;
  var y = this.screenHeight / 15;

  var backToSelectGameCallback = function () {
    this._cleanChildren();
    this._initialize();
    this.gamesReRenderCallback();
  };

  this.backToSelectGameButton = ButtonFactoryText(
    x,
    y,
    text,
    textStyle,
    backToSelectGameCallback.bind(this)
  );
};

// this function creates the play button for the games pages. This button created will be passed
// into the games page so when user click on the play button it will render the game
SelectGamesPage.prototype._createPlayButton = function (gameName) {
  var textStyle = {
    fill: '#ffffff',
    fontSize: 40,
    align: 'center',
  };
  var x = this.screenWidth / 2;
  var y = this.screenHeight * 0.9;

  var clickCallback = function () {
    this.changeMainContainerCallback(gameName);
  };
  var button = ButtonFactoryText(
    x,
    y,
    'Play',
    textStyle,
    clickCallback.bind(this)
  );
  return button;
};

SelectGamesPage.prototype._createGamesButton = function () {
  var currentX = this.startX;
  var currentY = this.startY;
  var currentIndex = 1;

  for (var currentGame of this.currentGames) {
    var width = this.screenHeight / 6;
    var height = this.screenWidth / 8;

    var buttonCallback = function () {
      this._cleanChildren();
      // add the back to select games page button and the play button first
      this.children.push(this.backToSelectGameButton);
      this.children.push(this._createPlayButton(currentGame.name));
      currentGame.page._initialize();
      // add each child from the selected game type
      for (var child of currentGame.page.children) {
        this.children.push(child);
      }

      // re-render the children of select games items
      this.gamesReRenderCallback();
    };
    var gameSprite = ButtonFactory(
      currentX,
      currentY,
      width,
      height,
      currentGame.sprite,
      buttonCallback.bind(this)
    );
    this.children.push(gameSprite);

    // change next button position
    currentX += this.xSpacing;
    if (currentIndex % MAX_COL == 0) {
      currentX = this.startX;
      currentY += this.ySpacing;
    }

    currentIndex++;
  }
};

SelectGamesPage.prototype._createTitle = function () {
  var textStyle = {
    fill: '#ffffff',
    fontSize: 40,
    fontWeight: 500,
    align: 'center',
  };

  var titleText = new PIXI.Text('Games', textStyle);
  titleText.anchor.set(0.5);
  titleText.x = this.screenWidth / 2;
  titleText.y = this.screenHeight / 8;
  this.children.push(titleText);
};

SelectGamesPage.prototype._cleanChildren = function () {
  this.children = [];
};

SelectGamesPage.prototype._initialize = function () {
  this._createBackToHomeButton();
  this._createTitle();
  this._createGamesButton();
};
