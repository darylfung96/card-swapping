<?php
/**
 * Create a new highest level leaderboard if highestlevel in the leaderboard does not exist yet
 *
 * @param [string] $leaderboardFilename - the filename to the leaderboard
 * @param [object] $AllLeaderboardInfo - the object that contains all the information for the leaderboard
 * @param [string] $id - the id to add into the leaderboard
 * @param [string] $value - the level of the user
 * @return void
 */
function createNewHighestLevelLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value) {
  $AllLeaderboardInfo->highestLevel = new stdClass();
  $AllLeaderboardInfo->highestLevel->{$id} = new stdClass();
  $AllLeaderboardInfo->highestLevel->{$id} = $value;

  file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  return json_encode($returnValue);
}

/**
 * Update the information for the current user in the highest level leaderboard content
 *
 * @param [string] $leaderboardFilename - the filename to the leaderboard
 * @param [string] $id - to id to update
 * @param [string] $value - the level of the current user
 * @return void
 */
function updateHighestLevelLeaderboard($leaderboardFilename, $id, $value) {
  $AllLeaderboardInfo = json_decode(file_get_contents($leaderboardFilename));
  if (file_exists($leaderboardFilename)) {
    // if highest level type does not exist then create it
    if (!$AllLeaderboardInfo->highestLevel) {

      return createNewhighestLevelLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
    } else {

      // update the highest level
      $AllLeaderboardInfo->highestLevel->{$id} = $value;
      $allLevels = (array)$AllLeaderboardInfo->highestLevel;
      arsort($allLevels);

      if (count($allLevels) > 100) {
        array_pop($allLevels);
      }

      $AllLeaderboardInfo->highestLevel = (object)$allLevels;

      file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
      $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
      return json_encode($returnValue);
    }
    // if leaderboard file does not exist yet then create it
  } else {
    $AllLeaderboardInfo = new stdClass();
    return createNewHighestLevelLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $id, $value);
  }
}
?>