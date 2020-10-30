<?php

/**
 * Create a new winning rate leaderboard
 *
 * @param [string] $leaderboardFilename - the filename to the leaderboard
 * @param [object] $AllLeaderboardInfo - the object information of the leaderboard
 * @param [string] $id - the user id to add into the leaderboard
 * @param [string] $value - the winning rate of this user
 * @return void
 */
function createNewWinningRateLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value) {
  $AllLeaderboardInfo->winningRate = new stdClass();
  $AllLeaderboardInfo->winningRate->{$id} = $value;

  file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  return json_encode($returnValue);
}

/**
 * Update the winning rate leaderboard
 *
 * @param [string] $leaderboardFilename - the filename of the leaderboard
 * @param [string] $id - the user to update
 * @param [string] $value - the value of the winning rate
 * @return void
 */
function updateWinningRateLeaderboard($leaderboardFilename, $id, $value) {
  // make NaN becomes zero
  if (strcmp($value, 'NaN') === 0) {
    $value = "0";
  }

  if (file_exists($leaderboardFilename)) {
    $AllLeaderboardInfo = json_decode(file_get_contents($leaderboardFilename));
    // if type does not exist, we create it and update leaderboard
    if (!$AllLeaderboardInfo->winningRate) {
      return createNewWinningRateLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
    }
    // add the winningRate and sort the leaderboard winningRate
    $AllLeaderboardInfo->winningRate->{$id} = $value;
    $leaderboardTypeInfo = (array)$AllLeaderboardInfo->winningRate;
    arsort($leaderboardTypeInfo);
  
    // store the top 100 only
    if (count($leaderboardTypeInfo) > 100) {
      array_pop($leaderboardTypeInfo);
    }
    // put back
    $AllLeaderboardInfo->winningRate = $leaderboardTypeInfo;
  
    file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
    $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
    return json_encode($returnValue);
  // if leaderboard file does not exist, create new one
  } else {
    $AllLeaderboardInfo = new stdClass();
    return createNewwinningRateLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
  }
}
?>