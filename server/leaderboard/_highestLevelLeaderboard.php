<?php

/**
 * Update the information for the current user in the highest level leaderboard content
 *
 * @param [string] $id - to id to update
 * @param [string] $value - the level of the current user
 * @return void
 */
function updateHighestLevelLeaderboard($id, $value) {
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "successfully updated leaderboard highestLevel", true);

  $conn = createConn();
  $sql = "select * from Leaderboard where leaderboardType='highestLevel' and userName='$id';";
  $result = $conn->query($sql);
  // if there exist, then we update
  if ($result->num_rows > 0) {
    $sql = "update Leaderboard set leaderboardValue=$value where userName='$id' and leaderboardType='highestLevel' ";
    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error updating leaderboard highestLevel: " . $conn->error, false);
    }
    // if does not exist, then we insert
  } else {
    $sql = "insert into Leaderboard (userName, leaderboardType, leaderboardValue) VALUES('$id', 'highestLevel', $value);";
    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error inserting leaderboard highestLevel: " . $conn->error, false);
    }
  }

  echo json_encode($returnValue);
}
?>