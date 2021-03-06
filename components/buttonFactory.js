/**
 * ButtonFactoryText creates a text that is clickable.
 * The return value is a PIXI Text
 * @param {float} x - the x position of the text button
 * @param {float} y - the y position of the text button
 * @param {string} text - the text for the text button
 * @param {object} textStyle - the style for the text
 * @param {function} clickCallback - the callback when clicked on this text button
 */
function ButtonFactoryText(x, y, text, textStyle, clickCallback) {
  var button = new PIXI.Text(text, textStyle);
  //
  if (clickCallback) button.interactive = true;
  if (clickCallback) button.buttonMode = true;
  button.x = x;
  button.y = y;
  button.anchor.set(0.5);

  // mouse handler
  const backButtonMouseOver = function () {
    this.style = { ...this.style, fontStyle: 'italic' };
  };
  const backButtonMouseOut = function () {
    this.style = { ...this.style, fontStyle: 'normal' };
  };
  const backButtonMouseDown = function () {
    this.scale.x = 0.9;
    this.scale.y = 0.9;
  };
  const backButtonMouseUp = function (clickCallback) {
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

/**
 * ButtonFactory creates a button with the sprite provided
 * returns the PIXI Sprite button 
 * 
  @param{float} x:                    position x
  @param{float} y:                    position y
  @param{int} width:                  The width of the button
  @param{int} height:                 the height of the butotn
  @param{string} buttonSprite:        The image of the button
  @param{function} clickCallback:     Callback for clicking this button
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
