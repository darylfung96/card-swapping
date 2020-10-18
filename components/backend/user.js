function createUser(email, callback) {
  $.post('server/createUser.php', { email }, (data) => {
    const json_data = JSON.parse(data);
    callback(json_data);
  });
}

function getUser(email, callback) {
  $.get('server/getUser.php', { email }, (data) => {
    const json_data = JSON.parse(data);
    callback(json_data);
  });
}
