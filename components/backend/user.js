function createUser(id, callback) {
  $.post('server/user/createUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

function updateUser(userInfo, callback) {
  const str_userInfo = JSON.stringify(userInfo);
  $.post('server/user/updateUser.php', { userInfo: str_userInfo }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

function getUser(id, callback) {
  $.get('server/user/getUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

function getUsers(callback) {
  $.get('server/user/getUsers.php', (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
