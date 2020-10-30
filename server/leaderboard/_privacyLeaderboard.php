<?php

/**
 * Update the privacy of the user. For instance if the user name is a and want to make it private.
 *  We will change all a to a_unknown in the leaderboard
 *
 * @param [string] $leaderboardFilename - the filename of the leaderboard 
 * @param [string] $id - the user to change the privacy
 * @param [string] $value - true/false (true will be made public, false will be made private)
 * @return void
 */
function updatePrivacyLeaderboard($leaderboardFilename, $id, $value) {
  if (file_exists($leaderboardFilename)) {
    $AllLeaderboardInfo = json_decode(file_get_contents($leaderboardFilename));
    $idUnknownString = "{$id}_unknown";

    // ---------- change the highestlevel ranking privacy ---------- //
    if ($AllLeaderboardInfo->highestLevel) {

      // if value is true (if it is going to be set to public)
      if (strcmp($value, 'true') === 0) {
        // ensure that there is the content available to set to public e.g: "id_unknown" key
        if ($AllLeaderboardInfo->highestLevel->{$idUnknownString}) {
          $AllLeaderboardInfo->highestLevel->{$id} = $AllLeaderboardInfo->highestLevel->{$idUnknownString};
          unset($AllLeaderboardInfo->highestLevel->{$idUnknownString});
        }
      } else {
        // ensure that there is the content available to set to public e.g: "id" key
        if ($AllLeaderboardInfo->highestLevel->{$id}) {
          $AllLeaderboardInfo->highestLevel->{$idUnknownString} = $AllLeaderboardInfo->highestLevel->{$id};
          unset($AllLeaderboardInfo->highestLevel->{$id});
        }
      }

      $highestLevelArray = (array)$AllLeaderboardInfo->highestLevel;
      arsort($highestLevelArray);
      $AllLeaderboardInfo->highestLevel = (object)$highestLevelArray;

    }
    
    // ---------- change the timesPlayed ranking privacy ---------- //
    if ($AllLeaderboardInfo->timesPlayed) {
      // if value is true (if it is going to be set to public)
      if (strcmp($value, 'true') === 0) {
        // ensure that there is the content available to set to public e.g: "id_unknown" key
        if ($AllLeaderboardInfo->timesPlayed->{$idUnknownString}) {
          $AllLeaderboardInfo->timesPlayed->{$id} = $AllLeaderboardInfo->timesPlayed->{$idUnknownString};
          unset($AllLeaderboardInfo->timesPlayed->{$idUnknownString});
        }
      } else {
        // ensure that there is the content available to set to public e.g: "id" key
        if ($AllLeaderboardInfo->timesPlayed->{$id}) {
          $AllLeaderboardInfo->timesPlayed->{$idUnknownString} = $AllLeaderboardInfo->timesPlayed->{$id};
          unset($AllLeaderboardInfo->timesPlayed->{$id});
        }
      }

      $timesPlayedArray = (array)$AllLeaderboardInfo->timesPlayed;
      arsort($timesPlayedArray);
      $AllLeaderboardInfo->timesPlayed = (object)$timesPlayedArray;
    }

    // ---------- change the winningRate ranking privacy ---------- //
    if ($AllLeaderboardInfo->winningRate) {
      // if value is true (if it is going to be set to public)
      if ($value === 'true') {
        // ensure that there is the content available to set to public e.g: "id_unknown" key
        if ($AllLeaderboardInfo->winningRate->{$idUnknownString}) {
          $AllLeaderboardInfo->winningRate->{$id} = $AllLeaderboardInfo->winningRate->{$idUnknownString};
          unset($AllLeaderboardInfo->winningRate->{$idUnknownString});
        }
      } else {

        // ensure that there is the content available to set to public e.g: "id" key
        if ($AllLeaderboardInfo->winningRate->{$id}) {
          $AllLeaderboardInfo->winningRate->{$idUnknownString} = $AllLeaderboardInfo->winningRate->{$id};
          unset($AllLeaderboardInfo->winningRate->{$id});
        }
      }
    } 

    file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
    $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
    return json_encode($returnValue);
  } else {
      $returnValue = generateResponse($returnValue, "No leaderboard information found, skipping", true);
  }
}
?>