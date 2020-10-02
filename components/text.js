/*
This function will create new line when the maximum character for each line is reached. 

It will receive text and it will create new line when for each block of maxLengthPerLine text.
*/
function descriptionText(text, maxLengthPerLine) {
  currentLineLength = 0;
  let newText = '';
  for (const char of text) {
    currentLineLength++;

    if (currentLineLength >= maxLengthPerLine && char == ' ') {
      newText += '\n';
      currentLineLength = 0;
    } else {
      newText += char;
    }
  }
  return newText;
}
