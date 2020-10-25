<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['userId'];
$challengedId = $_POST['challengedId'];
$userNormalizedScore = $_POST['userNormalizedScore'];
$type = $_POST['type'];
$isWon = $_POST['isWon']; // only for receive
$challengePrimaryKey = $_POST['challengePrimaryKey']; // only for receive
$userIdDir = "${FILE_STORAGE_DIR}/{$id}/";
$userFilename = "${userIdDir}/challenge.txt";

$returnValue = new stdClass();
$returnValue->id = $id;
$returnValue->challengedId = $challengedId;
$returnValue->userNormalizedScore = $userNormalizedScore;
$returnValue->type = $type;

$challengedIdDir = "${FILE_STORAGE_DIR}/{$challengedId}/";
$challengedUserFilename = "{$challengedIdDir}/challenge.txt";

$globalChallengeIdFilename = "${FILE_STORAGE_DIR}/challengeInfo.txt";

function getNextChallengeId($globalChallengeIdFilename) {

  if (!file_exists($globalChallengeIdFilename)) {
    $challengeInfoObject = new stdClass();
    $challengeInfoObject->total = 1;
    file_put_contents($globalChallengeIdFilename, json_encode($challengeInfoObject)) or die('error creating challenge id');
    return $challengeInfoObject->total;
  }

  $challengeInfoObject = json_decode(file_get_contents($globalChallengeIdFilename));
  $challengeInfoObject->total += 1;
  file_put_contents($globalChallengeIdFilename, json_encode($challengeInfoObject));
  return $challengeInfoObject->total;
}


function addChallenge($challengePrimaryKey, $filename, $currentId, $userNormalizedScore, $type) {
  $challengeObject = new stdClass();
  if (file_exists("$filename")) {
    // if file exist
    $challengeObject = json_decode(file_get_contents($filename));
  }


  $challengeObject->{$challengePrimaryKey} = new stdClass();
  $challengeObject->{$challengePrimaryKey}->id = $currentId;
  $challengeObject->{$challengePrimaryKey}->score = $userNormalizedScore;
  $challengeObject->{$challengePrimaryKey}->type = $type;
  $challengeObject->{$challengePrimaryKey}->challengePrimaryKey = $challengePrimaryKey;
  file_put_contents($filename, json_encode($challengeObject)) or die('Unable to save serialized json into file');
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
  return $returnValue;
}

function updateChallenge($challengePrimaryKey, $filename, $isWon) {
  $returnValue = new stdClass();

  if (!file_exists("$filename")) {
    $returnValue = generateResponse($returnValue, 'failed updating challenge', false);
    return $returnValue;
  }

  $challengeObject = json_decode(file_get_contents($filename));
  $challengeObject->{$challengePrimaryKey}->isWon = $isWon;
  print_r($challengeObject);
  file_put_contents($filename, json_encode($challengeObject));

  $returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
  return $returnValue;
}

if ($type === "send") {
  $challengePrimaryKey = getNextChallengeId($globalChallengeIdFilename);
  // add challenge to user that sends the challenge
  $returnValue = addChallenge($challengePrimaryKey, $userFilename, $challengedId, $userNormalizedScore, 'send');
  if ($returnValue->success) {
    // add challenge to user receiving the challenge
    $returnValue = addChallenge($challengePrimaryKey, $challengedUserFilename, $id, $userNormalizedScore, 'receive');

    // if the receive insertion is not successful, then we remove the insertion of the send
    if (!$returnValue->success) {
      $challengeArray = json_decode(file_get_contents($userFilename));
      array_shift($challengeArray);
      file_put_contents($filename, json_encode($challengeArray));
    }
  }

} else if ($type === "receive") {
    $returnValue = updateChallenge($challengePrimaryKey, $userFilename, $isWon === 'true');
    if ($returnValue->success) {
      $returnValue = updateChallenge($challengePrimaryKey, $challengedUserFilename, $isWon !== 'true');
    }
} 
echo json_encode($returnValue);

?>
