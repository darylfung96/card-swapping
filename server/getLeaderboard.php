<?php
include 'returnResponse.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// leaderboardInfo should contain this format
// leaderBoardInfo = {timesPlayed: {id1: 5, id2: 12, id3: 1}, highestScore: {}...}

$type = $_GET["type"];

$userFilename = "fileStorage/leaderboard.txt";

if (file_exists($userFilename)) {
  $leaderboardInfo = json_decode(file_get_contents($userFilename));
  $returnValue->leaderboard = (array)$leaderboardInfo->{$type};
  arsort($returnValue->leaderboard);
  $returnValue = generateResponse($returnValue, "Successfully obtained {$type} leaderboard", true);
  echo json_encode($returnValue);
return;
} else {
  $returnValue = generateResponse($returnValue, "leaderboard not found", false);
  echo json_encode($returnValue);
}
?>
