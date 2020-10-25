<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['userId'];
$challengedId = $_POST['challengedId'];
$userNormalizedScore = $_POST['userNormalizedScore'];

$userIdDir = "${FILE_STORAGE_DIR}/{$id}/";
$userFilename = "${userIdDir}/challenge.txt";

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
  file_put_contents($filename, json_encode($challengeObject)) or die('Unable to save serialized json into file');
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
  return $returnValue;
}

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
  echo json_encode($returnValue);
}

?>
