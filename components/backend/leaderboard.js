/**
 *
 * @param {int} id - the id for the current user
 * @param {string} type - update the specific type in the leaderboard (mostPlayed, highestLevel, winningRate)
 * @param {int} value - The value to update to
 * @param {function} callback - the callback function to run once received response
 */
function updateLeaderboard(id, type, value, callback) {
  $.post(
    'server/leaderboard/updateLeaderboard.php',
    { id, type, value },
    (data) => {
      const json_data = JSON.parse(data);
      if (callback) callback(json_data);
    }
  );
}

/**
 *
 * @param {string} type - the type to receive from the leaderboard (mostPlayed, highestLevel, winningRate)
 * @param {function} callback - the callback function to run once received response
 */
function getLeaderboard(type, callback) {
  $.get('server/leaderboard/getLeaderboard.php', { type }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
