<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$allPlayers = array_diff(scandir("${FILE_STORAGE_DIR}"), array('.', '..', 'leaderboard.txt', 'challengeInfo.txt'));
$allPlayersInfo = [];

foreach($allPlayers as $player) {
  $playerInformation = json_decode(file_get_contents("${FILE_STORAGE_DIR}/{$player}/info.txt"));
  $playerLevel = new stdClass();
  $playerLevel->{$player} = $playerInformation->level;
  array_push($allPlayersInfo, $playerLevel);
}

$returnValue = new stdClass();
$returnValue->allPlayers = $allPlayersInfo;
$returnValue = generateResponse($returnValue, "Successfully obtain all players", true);
echo json_encode($returnValue);
?>
