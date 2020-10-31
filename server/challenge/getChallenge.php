<?php
include '../returnResponse.php';
include '../common.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_GET['id'];

$conn = createConn();
$sql = "SELECT * from Challenge WHERE senderName='$id' or receiverName='$id' ORDER BY id DESC";

$challengeArray = [];
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $currentChallenge = new stdClass();
    if (strcmp($row['senderName'], $id) !== 0) {
      $currentChallenge->id = $row['senderName'];
      $currentChallenge->type = 'receive';
    }
    else if (strcmp($row['receiverName'], $id) !== 0) {
      $currentChallenge->id = $row['senderName'];
      $currentChallenge->type = 'send';
    }

    $currentChallenge->score = $row['userNormalizedScore'];
    $currentChallenge->seed = $row['seed'];
    $currentChallenge->challengePrimaryKey = $row['id'];
    $currentChallenge->result = $row['result'];
    array_push($challengeArray, $currentChallenge);
  }
  $returnValue->challenges = $challengeArray;
}

$returnValue = generateResponse($returnValue, 'successfully obtain challenge', true);
echo json_encode($returnValue);


?>
