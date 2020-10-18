function updateLeaderboard(id, timesPlayed, callback) {
  $.post('server/updateLeaderboard.php', { id, timesPlayed }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
