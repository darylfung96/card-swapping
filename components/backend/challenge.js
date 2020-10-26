function sendChallenge(
  challengePrimaryKey,
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

function getChallenge(id, callback) {
  $.get('server/challenge/getChallenge.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
