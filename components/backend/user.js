/**
 *
 * @param {int} id - the id of the current user
 * @param {function} callback - the callback function to run once received response
 */
function createUser(id, callback) {
  $.post('server/user/createUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

/**
 *
 * @param {object} userInfo - the information object of the current user
 * @param {function} callback - the callback function to run once received response
 */
function updateUser(userInfo, callback) {
  const str_userInfo = JSON.stringify(userInfo);
  $.post('server/user/updateUser.php', { userInfo: str_userInfo }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

/**
 *
 * @param {int} id - the id of the current user
 * @param {function} callback - the callback function to run once received response
 */
function getUser(id, callback) {
  $.get('server/user/getUser.php', { id }, (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}

/**
 *
 * @param {function} callback - the callback function to run once received response
 */
function getUsers(callback) {
  $.get('server/user/getUsers.php', (data) => {
    const json_data = JSON.parse(data);
    if (callback) callback(json_data);
  });
}
