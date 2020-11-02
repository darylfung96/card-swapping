<?php

/**
 * Update the privacy of the user. For instance if the user name is a and want to make it private.
 *  We will change all a to a_unknown in the leaderboard
 *
 * @param [string] $id - the user to change the privacy
 * @param [string] $value - true/false (true will be made public, false will be made private)
 * @return void
 */
function updatePrivacyLeaderboard($id, $value) {
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, 'successfully updated leaderboard privacy', true);

  $conn = createConn();
  $idUnknown = "{$id}_unknown";
  if (strcmp($value, 'true') === 0) {
    $sql = "update Leaderboard set userName='$id' where userName='$idUnknown'";
  } else {
    $sql = "update Leaderboard set userName='$idUnknown' where userName='$id'";
  }

  if ($conn->query($sql) !== TRUE) {
    $returnValue = generateResponse($returnValue, "error updating leaderboard privacy: " . $conn->error, false);
  }

  echo json_encode($returnValue);
}
?>