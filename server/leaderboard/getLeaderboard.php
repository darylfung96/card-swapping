<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// leaderboardInfo should contain this format
// leaderBoardInfo = {timesPlayed: {id1: 5, id2: 12, id3: 1}, highestScore: {level: {id: score, id: score, ...}, ...}...}

$type = $_GET["type"];
if (file_exists($LEADERBOARD_FILENAME)) {
  $leaderboardInfo = json_decode(file_get_contents($LEADERBOARD_FILENAME));
  $returnValue->leaderboard = (array)$leaderboardInfo->{$type};
  $returnValue = generateResponse($returnValue, "Successfully obtained {$type} leaderboard", true);
  echo json_encode($returnValue);
} else {
  $returnValue = generateResponse($returnValue, "leaderboard not found", false);
  echo json_encode($returnValue);
}
?>
