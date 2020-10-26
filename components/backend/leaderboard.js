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

function getLeaderboard(type, callback) {
  $.get('server/leaderboard/getLeaderboard.php', { type }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
