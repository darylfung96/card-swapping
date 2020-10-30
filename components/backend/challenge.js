/**
 *
 * @param {int} challengePrimaryKey - The primary key for the challenge
 * @param {string} seed - the seed used in this challenge
 * @param {string} userId - the user ID for the current player
 * @param {string} challengedId - the user ID of the challenged player
 * @param {float} userNormalizedScore - the score that the user obtained
 * @param {string} type - what type is it? receive/send  (send means the userId is sending challenge to challengeId)
 * (receive means userId receive challenge and accept challenge from challegenId)
 * @param {string} result - the result of the match (win, lose, tie)
 * @param {function} callback - the callback function to run once the receive response
 */
function sendChallenge(
  challengePrimaryKey,
  seed,
  userId,
  challengedId,
  userNormalizedScore,
  type,
  result,
  callback
) {
  $.post(
    'server/challenge/sendChallenge.php',
    {
      challengePrimaryKey,
      seed,
      userId,
      challengedId,
      userNormalizedScore,
      type,
      result,
    },

    (data) => {
      console.log(data);
      const json_data = JSON.parse(data);
      if (callback) callback(json_data);
    }
  );
}

/**
 *
 * @param {int} id - the id of the current user
 * @param {function} callback - the function callback to run once receive response
 */
function getChallenge(id, callback) {
  $.get('server/challenge/getChallenge.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
