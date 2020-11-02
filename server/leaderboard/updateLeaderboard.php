<?php
include '../returnResponse.php';
include './_timesPlayedLeaderboard.php';
include './_highestLevelLeaderboard.php';
include './_winningRateLeaderboard.php';
include './_privacyLeaderboard.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['id'];
$type = $_POST['type'];
$value = $_POST['value'];

if (strcmp($type, 'timesPlayed') === 0) {
  echo updateTimesPlayedLeaderboard($id, $value);
  return;
} else if (strcmp($type, 'highestLevel') === 0) {
  echo updateHighestlevelLeaderboard($id, $value); 
  return;
} else if (strcmp($type, 'winningRate') === 0) {
  echo updateWinningRateLeaderboard($id, $value); 
  return;
} else if (strcmp($type, 'privacy') === 0) { // true will be public, false will be private
  echo updatePrivacyLeaderboard($id, $value);
  return;
}

?>
