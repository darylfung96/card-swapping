//========================= login page =========================//
Menu.prototype._enterMainPage = function () {
  const email = this.emailText.text;
  const validateEmail = function () {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return true;
    }
    return false;
  };
  if (!validateEmail(email)) {
    this.errorText = this.__createText(
      'Please enter a valid email',
      { fill: 'red', fontSize: 25 },
      this.screenWidth * 0.5,
      this.screenHeight * 0.3
    );
    this.addChild(this.errorText);
    return;
  }

  // if email is valid
  if (this.errorText) this.removeChild(this.errorText);

  // add cookie for the username
  // add user to the server
  const createUserCallback = function (data) {
    console.log(data);
    if (!data.success) {
      if (this.errorText) this.removeChild(this.errorText);
      this.errorText = this.__createText(
        `Error: ${data.msg}`,
        { fill: 'red', fontSize: 25 },
        this.screenWidth * 0.5,
        this.screenHeight * 0.3
      );
      this.addChild(this.errorText);
      return;
    }

    setCookie('email', email, 30);
    console.log(data);

    this._removeLoginPage();
    this._createMainPage();
  };

  createUser(email, createUserCallback.bind(this));
};

Menu.prototype._createLoginPage = function () {
  this.emailText = new PIXI.TextInput({
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
  this.emailText.placeholder = 'Enter your email';
  this.emailText.x = this.screenWidth * 0.5;
  this.emailText.y = this.screenHeight * 0.4;
  this.emailText.pivot.x = this.emailText.width / 2;
  this.emailText.pivot.y = this.emailText.height / 2;
  this.addChild(this.emailText);

  this.enterText = this.__createText(
    'Enter',
    { fill: '#fff', fontSize: 30 },
    this.screenWidth * 0.5,
    this.screenHeight * 0.5,
    this._enterMainPage.bind(this)
  );
  this.addChild(this.enterText);
};

Menu.prototype._removeLoginPage = function () {
  if (this.emailText) this.removeChild(this.emailText);
  if (this.enterText) this.removeChild(this.enterText);
};
