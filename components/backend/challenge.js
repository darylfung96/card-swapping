function sendChallenge(userId, challengedId, userNormalizedScore, callback) {
  $.post(
    'server/challenge/sendChallenge.php',
    { userId, challengedId, userNormalizedScore },
    (data) => {
      const json_data = JSON.parse(data);
      if (callback) callback(json_data);
    }
  );
}

function getChallenge(id, callback) {
  $.get('server/challenge/getChallenge.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
