<?php

/**
 * Create the leaderboad for timesPlayed when timesPlayed does not exist yet
 *
 * @param [string] $leaderboardFilename - the filename to the leaderboard
 * @param [object] $AllLeaderboardInfo - the information of the leaderboard
 * @param [string] $id - the user id to add into the leaderboard
 * @param [string] $value - the number of timesPlayed
 * @return void
 */
function createNewTimesPlayedLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value) {
  $AllLeaderboardInfo->timesPlayed = new stdClass();
  $AllLeaderboardInfo->timesPlayed->{$id} = $value;

  file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  return json_encode($returnValue);
}

function updateTimesPlayedLeaderboard($leaderboardFilename, $id, $value) {
  
  if (file_exists($leaderboardFilename)) {
    $AllLeaderboardInfo = json_decode(file_get_contents($leaderboardFilename));
    // if type does not exist, we create it and update leaderboard
    if (!$AllLeaderboardInfo->timesPlayed) {
      return createNewTimesPlayedLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
    }
    // add the timesPlayed and sort the leaderboard timesPlayed
    $AllLeaderboardInfo->timesPlayed->{$id} = $value;
    $leaderboardTypeInfo = (array)$AllLeaderboardInfo->timesPlayed;
    arsort($leaderboardTypeInfo);
  
    // store the top 100 only
    if (count($leaderboardTypeInfo) > 100) {
      array_pop($leaderboardTypeInfo);
    }
    // put back
    $AllLeaderboardInfo->timesPlayed = $leaderboardTypeInfo;
  
    file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
    $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
    return json_encode($returnValue);
  // if leaderboard file does not exist, create new one
  } else {
    $AllLeaderboardInfo = new stdClass();
    return createNewTimesPlayedLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
  }
}
?>