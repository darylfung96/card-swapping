function createUser(id, callback) {
  $.post('server/createUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

function updateUser(userInfo, callback) {
  const str_userInfo = JSON.stringify(userInfo);
  $.post('server/updateUser.php', { userInfo: str_userInfo }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

function getUser(id, callback) {
  $.get('server/getUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
