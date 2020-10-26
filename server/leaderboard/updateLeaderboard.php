<?php
include '../returnResponse.php';
include './_timesPlayedLeaderboard.php';
include './_highestLevelLeaderboard.php';
include './_winningRateLeaderboard.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// leaderboardInfo should contain this format
// leaderBoardInfo = {timesPlayed: {id1: 5, id2: 12, id3: 1}, highestScore: {level3: {id1: 6, id2:3}, level2: {id1: 5, id2:3}}...}

$id = $_POST['id'];
$type = $_POST['type'];
$value = $_POST['value'];

// check if user exist
$userFileDir = "${FILE_STORAGE_DIR}/{$id}/";
$userFilename = "{$userFileDir}/info.txt";
if (!file_exists($userFilename)) {
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "user {$id} not found", false);
  echo json_encode($returnValue);
  return;
}
if (strcmp($type, 'timesPlayed') === 0) {
  echo updateTimesPlayedLeaderboard($LEADERBOARD_FILENAME, $id, $value);
  return;
} else if (strcmp($type, 'highestLevel') === 0) {
  echo updateHighestlevelLeaderboard($LEADERBOARD_FILENAME, $id, $value); 
  return;
} else if (strcmp($type, 'winningRate') === 0) {
  echo updateWinningRateLeaderboard($LEADERBOARD_FILENAME, $id, $value); 
  return;
}

?>
