<?php

function updateTimesPlayedLeaderboard($id, $value) {
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "successfully updated leaderboard timesPlayed", true);

  $conn = createConn();
  $sql = "select * from Leaderboard where leaderboardType='timesPlayed' and userName='$id';";
  $result = $conn->query($sql);
  // if there exist, then we update
  if ($result->num_rows > 0) {
    $sql = "update Leaderboard set leaderboardValue=$value where userName='$id' and leaderboardType='timesPlayed' ";
    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error updating leaderboard timesPlayed: " . $conn->error, false);
    }
    // if does not exist, then we insert
  } else {
    $sql = "insert into Leaderboard (userName, leaderboardType, leaderboardValue) VALUES('$id', 'timesPlayed', $value);";

    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error inserting leaderboard timesPlayed: " . $conn->error, false);
    }
  }

  echo json_encode($returnValue);

}
?>