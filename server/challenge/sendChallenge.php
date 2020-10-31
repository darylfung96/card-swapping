<?php
include '../returnResponse.php';
include '../common.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$userId = $_POST['userId'];
$seed = $_POST['seed'];
$challengedId = $_POST['challengedId'];
$userNormalizedScore = $_POST['userNormalizedScore'];
$type = $_POST['type'];
$result = $_POST['result']; // only for receive
$challengePrimaryKey = $_POST['challengePrimaryKey']; // only for receive


/**
 * Add the challenge to the user id provided
 *
 * @param [string] $userId - the userId 
 * @param [string] $challengedId - the challenged user id
 * @param [float] $userNormalizedScore - the score this user obtained
 * @param [string] $type - receive/send (the type of the challenge for this user)
 * @param [string] $seed - the seed in this challenge
 * @return void
 */
function addChallenge($userId, $challengedId, $userNormalizedScore, $seed) {
  $conn = createConn();
  $sql = "INSERT INTO Challenge (senderName, receiverName, userNormalizedScore, seed) " .
  "VALUES ('$userId', '$challengedId', $userNormalizedScore, '$seed');";
  print_r($sql);
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "Successfully added challenge", true);
  if ($conn->query($sql) !== TRUE) {
    $returnValue = generateResponse($returnValue, "Fail adding challenge: " . $conn->error, false);
  }
  return $returnValue;
}

/**
 * Update existing challenge information
 *
 * @param [type] $challengePrimaryKey - the challenge primary key 
 * @param [type] $result - the result (win, lose, tie) for the receiver 
 * @return void
 */
function updateChallenge($challengePrimaryKey, $result) {
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, "Successfully updated challenge", true);
  $conn = createConn();

  $sql = "UPDATE Challenge SET result='$result' where id=$challengePrimaryKey;";

  if ($conn->query($sql) !== TRUE) {
    $returnValue = generateResponse($returnValue, "Error updating Challenge: " . $conn->error, false);
  }
  return $returnValue;
}

$returnValue = new stdClass();

if ($type === "send") {
  // add challenge to user that sends the challenge
  $returnValue = addChallenge($userId, $challengedId, $userNormalizedScore, $seed);
} else if ($type === "receive") {
    $returnValue = updateChallenge($challengePrimaryKey, $result);
} 
echo json_encode($returnValue);

?>
