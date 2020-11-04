<?php
include '../returnResponse.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_GET['id'];

$conn = createConn();
$sql = "SELECT * from Challenge WHERE senderName='$id' or receiverName='$id' ORDER BY id DESC";
$returnValue = new stdClass();
$challengeArray = [];
$returnValue->challenges = $challengeArray;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $currentChallenge = new stdClass();
    // if the player is not the one who sends it
    if (strcmp($row['senderName'], $id) !== 0) {
      $currentChallenge->id = $row['senderName'];
      $currentChallenge->type = 'receive';
      $currentChallenge->result = $row['result'];
    }
    // if the player is not the one who receives it (the sender), then the actual result will be the opposite of the result
    else if (strcmp($row['receiverName'], $id) !== 0) {
      $currentChallenge->id = $row['receiverName'];
      $currentChallenge->type = 'send';

      if (strcmp($row['result'], 'win') === 0) $currentChallenge->result = 'lose';
      else if (strcmp($row['result'], 'lose') === 0) $currentChallenge->result = 'win';
      else $currentChallenge->result = $row['result'];
    }


    $currentChallenge->score = $row['userNormalizedScore'];
    $currentChallenge->seed = $row['seed'];
    $currentChallenge->challengePrimaryKey = $row['id'];
    array_push($challengeArray, $currentChallenge);
  }
  $returnValue->challenges = $challengeArray;
}

$returnValue = generateResponse($returnValue, 'successfully obtain challenge', true);
echo json_encode($returnValue);


?>
