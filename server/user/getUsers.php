<?php
include '../returnResponse.php';
include '../common.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$conn = createConn();
$returnValue = new stdClass();
$allPlayers = [];

$sql = "SELECT userName, userLevel from User";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $currentPlayer = $row['userName'];
    $currentLevel = $row['userLevel'];
    $playerObject = new stdClass();
    $playerObject->{$currentPlayer} = $currentLevel;
    array_push($allPlayers, $playerObject);
  }
}

$returnValue = new stdClass();
$returnValue->allPlayers = $allPlayers;
$returnValue = generateResponse($returnValue, "Successfully obtained all players", true);
echo json_encode($returnValue);

// $allPlayers = array_diff(scandir("${FILE_STORAGE_DIR}"), array('.', '..', 'leaderboard.txt', 'challengeInfo.txt'));
// $allPlayersInfo = [];

// foreach($allPlayers as $player) {
//   $playerInformation = json_decode(file_get_contents("${FILE_STORAGE_DIR}/{$player}/info.txt"));
//   $playerLevel = new stdClass();
//   $playerLevel->{$player} = $playerInformation->level;
//   array_push($allPlayersInfo, $playerLevel);
// }

// $returnValue = new stdClass();
// $returnValue->allPlayers = $allPlayersInfo;
// $returnValue = generateResponse($returnValue, "Successfully obtain all players", true);
// echo json_encode($returnValue);
// ?>
