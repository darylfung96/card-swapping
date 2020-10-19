function updateLeaderboard(id, type, level, value, callback) {
  $.post(
    'server/leaderboard/updateLeaderboard.php',
    { id, type, level, value },
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
