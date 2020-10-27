//========================= login page =========================//
Menu.prototype._enterMainPage = function () {
  const id = this.idText.text;

  if (this.errorText) this.removeChild(this.errorText);
  const createUserCallback = function (data) {
    if (!data.success) {
      this.errorText = new PIXI.Text(`Error: ${data.msg}`, {
        fill: 'red',
        fontSize: 25,
      });
      this.errorText.x = this.screenWidth * 0.5;
      this.errorText.y = this.screenHeight * 0.3;
      this.errorText.anchor.set(0.5);
      this.addChild(this.errorText);
    } else {
      // successfully created user
      setCookie('id', id, 365);
      this._removeLoginPage();
      this._createMainPage();
    }
  };
  createUser(id, createUserCallback.bind(this));
};

Menu.prototype._createLoginPage = function () {
  // current method (login or create id)
  this.isLoginText = new PIXI.Text('Name', { fill: '#fff', fontSize: 25 });
  this.isLoginText.x = this.screenWidth * 0.5;
  this.isLoginText.y = this.screenHeight * 0.25;
  this.isLoginText.anchor.set(0.5);
  this.addChild(this.isLoginText);

  this.idText = new PIXI.TextInput({
    input: {
      fontSize: '25px',
      padding: '12px',
      width: `${this.screenWidth * 0.5}px`,
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
  this.idText.placeholder = 'What is your name?';
  this.idText.x = this.screenWidth * 0.5;
  this.idText.y = this.screenHeight * 0.4;
  this.idText.pivot.x = this.idText.width / 2;
  this.idText.pivot.y = this.idText.height / 2;
  this.addChild(this.idText);

  this.enterText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Enter',
    { fill: '#fff', fontSize: 30 },

    this._enterMainPage.bind(this)
  );

  this.addChild(this.enterText);
};

Menu.prototype._removeLoginPage = function () {
  if (this.idText) this.removeChild(this.idText);
  if (this.enterText) this.removeChild(this.enterText);
  if (this.createIdText) this.removeChild(this.createIdText);
  if (this.errorText) this.removeChild(this.errorText);
  if (this.isLoginText) this.removeChild(this.isLoginText);
};
