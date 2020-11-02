<?php
include '../returnResponse.php';
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
    $currentLevel = (int)$row['userLevel'];
    $playerObject = new stdClass();
    $playerObject->{$currentPlayer} = $currentLevel;
    array_push($allPlayers, $playerObject);
  }
}

$returnValue = new stdClass();
$returnValue->allPlayers = $allPlayers;
$returnValue = generateResponse($returnValue, "Successfully obtained all players", true);
echo json_encode($returnValue);
?>
