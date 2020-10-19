//========================= signUp page =========================//
Menu.prototype._enterLoginPage = function () {
  this._removeSignupPage();
  this._createLoginPage();
};

Menu.prototype._createUser = function () {
  this.removeChild(this.errorText);
  this.removeChild(this.successText);

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
      this.successText = new PIXI.Text('Successfully created user', {
        fill: '#8cff82',
        fontSize: 25,
      });
      this.successText.x = this.screenWidth * 0.5;
      this.successText.y = this.screenHeight * 0.3;
      this.successText.anchor.set(0.5);
      this.addChild(this.successText);
    }
  };

  if (!this.idText.text) {
    this.errorText = new PIXI.Text('Error: Please provide an ID', {
      fill: 'red',
      fontSize: 25,
    });
    this.errorText.x = this.screenWidth * 0.5;
    this.errorText.y = this.screenHeight * 0.3;
    this.errorText.anchor.set(0.5);
    this.addChild(this.errorText);
    return;
  }

  createUser(this.idText.text, createUserCallback.bind(this));
};

Menu.prototype._createSignupPage = function () {
  this.isLoginText = new PIXI.Text('Create ID', { fill: '#fff', fontSize: 25 });
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
  this.idText.placeholder = 'Enter an ID';
  this.idText.x = this.screenWidth * 0.5;
  this.idText.y = this.screenHeight * 0.4;
  this.idText.pivot.x = this.idText.width / 2;
  this.idText.pivot.y = this.idText.height / 2;
  this.addChild(this.idText);

  this.signUpText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    'Create',
    { fill: '#fff', fontSize: 30 },
    this._createUser.bind(this)
  );

  this.createIdText = ButtonFactoryText(
    this.screenWidth * 0.5,
    this.screenHeight * 0.55,
    'Click here to sign in',
    { fill: '#fff', fontSize: 20 },
    this._enterLoginPage.bind(this)
  );
  this.addChild(this.signUpText);
  this.addChild(this.createIdText);
};

Menu.prototype._removeSignupPage = function () {
  if (this.idText) this.removeChild(this.idText);
  if (this.signUpText) this.removeChild(this.signUpText);
  if (this.createIdText) this.removeChild(this.createIdText);
  if (this.errorText) this.removeChild(this.errorText);
  if (this.successText) this.removeChild(this.successText);
  if (this.isLoginText) this.removeChild(this.isLoginText);
};
