<?php
include 'returnResponse.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// leaderboardInfo should contain this format
// leaderBoardInfo = {timesPlayed: {id1: 5, id2: 12, id3: 1}, highestScore: {}...}

$id = $_POST['id'];
$timesPlayed = $_POST['timesPlayed'];
$userFilename = "fileStorage/leaderboard.txt";


if (file_exists($userFilename)) {
  $leaderboardInfo = json_decode(file_get_contents($userFilename));

  $leaderboardInfo->timesPlayed->{$id} = $timesPlayed;
  file_put_contents($userFilename, json_encode($leaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  echo json_encode($returnValue);
return;
} else {
  $leaderboardInfo = new stdClass();

  $leaderboardInfo->timesPlayed = new stdClass();
  $leaderboardInfo->timesPlayed->{$id} = $timesPlayed;
  file_put_contents($userFilename, json_encode($leaderboardInfo));
  $returnValue = generateResponse($returnValue, "Successfully updated leaderboard", true);
  echo json_encode($returnValue);
}
?>
