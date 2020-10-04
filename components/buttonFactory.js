/*
  x:                    position x
  y:                    position y
  buttonSprite:         The image of the button
  clickCallback:        Callback for clicking this button

*/
function ButtonFactorySprite(x, y, outSprite, onOverSprite, clickCallback) {
  var button = PIXI.Sprite.fromImage(outSprite);
  var textureUp = PIXI.Texture.fromImage(outSprite);
  var textureOver = PIXI.Texture.fromImage(onOverSprite);

  // adjust button
  button.anchor.set(0.5);
  button.position.x = x;
  button.position.y = y;
  button.interactive = true;

  mouseOverCallBack = function () {
    this.texture = textureOver;
  };
  mouseOutCallBack = function () {
    this.texture = textureUp;
  };
  mouseDownCallBack = function () {
    this.scale.x = 0.9;
    this.scale.y = 0.9;
  };
  mouseUpCallBack = function (clickCallback) {
    this.scale.x = 1;
    this.scale.y = 1;

    if (clickCallback) clickCallback();
  };

  button
    .on('mouseover', mouseOverCallBack)

    .on('touchstart', mouseDownCallBack)
    .on('mousedown', mouseDownCallBack)

    // set the mouseup and touchend callback...
    .on('mouseup', mouseUpCallBack.bind(button, clickCallback))
    .on('touchend', mouseUpCallBack.bind(button, clickCallback))
    .on('mouseupoutside', mouseUpCallBack)
    .on('touchendoutside', mouseUpCallBack)

    .on('mouseout', mouseOutCallBack);

  return button;
}

function ButtonFactoryText(x, y, text, textStyle, clickCallback) {
  var button = new PIXI.Text(text, textStyle);
  //
  button.interactive = true;
  button.buttonMode = true;
  button.x = x;
  button.y = y;
  button.anchor.set(0.5);

  // mouse handler
  backButtonMouseOver = function () {
    this.setStyle({ ...textStyle, fontStyle: 'italic' });
  };
  backButtonMouseOut = function () {
    this.setStyle({ ...textStyle, fontStyle: 'normal' });
  };
  backButtonMouseDown = function () {
    this.scale.x = 0.9;
    this.scale.y = 0.9;
  };
  backButtonMouseUp = function (clickCallback) {
    this.scale.x = 1;
    this.scale.y = 1;

    if (clickCallback) clickCallback();
  };

  button
    .on('mouseover', backButtonMouseOver)
    .on('mouseout', backButtonMouseOut)
    // mouse down
    .on('mousedown', backButtonMouseDown)
    .on('touchstart', backButtonMouseDown)
    // mouse up
    .on('mouseup', backButtonMouseUp.bind(button, clickCallback))
    .on('touchend', backButtonMouseUp.bind(button, clickCallback))
    .on('mouseupoutside', backButtonMouseUp)
    .on('touchendoutside', backButtonMouseUp);

  return button;
}

/*
  x:                    position x
  y:                    position y
  buttonSprite:         The image of the button
  clickCallback:        Callback for clicking this button

*/
function ButtonFactory(x, y, width, height, buttonSprite, clickCallback) {
  var button = new PIXI.Sprite.fromImage(buttonSprite);

  // adjust button
  button.anchor.set(0.5);
  button.x = x;
  button.y = y;
  button.width = width;
  button.height = height;
  button.interactive = true;
  button.buttonMode = true;

  var mouseDown = function () {
    this.width -= 10;
    this.height -= 10;
  };
  var mouseUp = function (clickCallback) {
    this.width += 10;
    this.height += 10;
    if (clickCallback) clickCallback();
  };
  var mouseOver = function () {
    this.alpha = 0.8;
  };
  var mouseOut = function () {
    this.alpha = 1;
  };

  button
    .on('mouseover', mouseOver)

    .on('touchstart', mouseDown)
    .on('mousedown', mouseDown)

    // set the mouseup and touchend callback...
    .on('mouseup', mouseUp.bind(button, clickCallback))
    .on('touchend', mouseUp.bind(button, clickCallback))
    .on('mouseupoutside', mouseUp)
    .on('touchendoutside', mouseUp)

    .on('mouseout', mouseOut);

  return button;
}
