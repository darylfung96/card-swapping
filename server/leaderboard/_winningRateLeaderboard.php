<?php

/**
 * Update the winning rate leaderboard
 *
 * @param [string] $id - the user to update
 * @param [string] $value - the value of the winning rate
 * @return void
 */
function updateWinningRateLeaderboard($id, $value) {
  // make NaN becomes zero
  if (strcmp($value, 'NaN') === 0) {
    $value = 0;
  }

  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "successfully updated leaderboard winningRate", true);

  $conn = createConn();
  $sql = "select * from Leaderboard where leaderboardType='winningRate' and userName='$id';";
  $result = $conn->query($sql);
  // if there exist, then we update
  if ($result->num_rows > 0) {
    $sql = "update Leaderboard set leaderboardValue=$value where userName='$id' and leaderboardType='winningRate' ";
    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error updating leaderboard winningRate: " . $conn->error, false);
    }
    // if does not exist, then we insert
  } else {
    $sql = "insert into Leaderboard (userName, leaderboardType, leaderboardValue) VALUES('$id', 'winningRate', $value);";

    if ($conn->query($sql) !== TRUE) {
      $returnValue = generateResponse($returnValue, "Error inserting leaderboard winningRate: " . $conn->error, false);
    }
  }

  return json_encode($returnValue);
}
?>