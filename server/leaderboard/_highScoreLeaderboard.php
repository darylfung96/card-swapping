<?php
function createNewHighScoreLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $level, $id, $value) {
  $AllLeaderboardInfo->highScore = new stdClass();
  $AllLeaderboardInfo->highScore->{$level} = new stdClass();
  $AllLeaderboardInfo->highScore->{$level}->{$id} = $value;

  file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  return json_encode($returnValue);
}

function updateHighScoreLeaderboard($leaderboardFilename, $level, $id, $value) {
  $AllLeaderboardInfo = json_decode(file_get_contents($leaderboardFilename));

  if (file_exists($leaderboardFilename)) {
    // if high score type does not exist then create it
    if (!$AllLeaderboardInfo->highScore) {
      return createNewHighScoreLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $level, $id, $value);
    } else {
      // update the high score
      
      // check if level exist and create
      if (!$AllLeaderboardInfo->highScore->{$level}){ 
        $AllLeaderboardInfo->highScore->{$level} = new stdClass();
        // sort the levels
        $allLevels = (array)$AllLeaderboardInfo->highScore;
        krsort($allLevels);
        $AllLeaderboardInfo->highScore = (object)$allLevels;
      }

      $currentScore = $AllLeaderboardInfo->highScore->{$level}->{$id} ? $AllLeaderboardInfo->highScore->{$level}->{$id} : -100;
  
      // only update if the new score is higher than the score contained in the leaderboard
      if ($value < $currentScore) {
        $returnValue = new stdClass();
        $returnValue = generateResponse($returnValue, "Score not higher than the current score, not updated", true);
        echo json_encode($returnValue);
        return;
      }
      // update the leaderboard of high score because the new score is higher
      $AllLeaderboardInfo->highScore->{$level}->{$id} = $value;
      $currentLevel = (array)$AllLeaderboardInfo->highScore->{$level};
      arsort($currentLevel);

      if (count($currentLevel) > 100) {
        array_pop($currentLevel);
      }
      // put back
      $AllLeaderboardInfo->highScore->{$level} = $currentLevel;

      file_put_contents($leaderboardFilename, json_encode($AllLeaderboardInfo));
      $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
      return json_encode($returnValue);
    }
    // if leaderboard file does not exist yet then create it
  } else {
    $AllLeaderboardInfo = new stdClass();
    return createNewHighScoreLeaderboard($leaderboardFilename, $AllLeaderboardInfo, $level, $id, $value);
  }
}
?>