<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['userId'];
$seed = $_POST['seed'];
$challengedId = $_POST['challengedId'];
$userNormalizedScore = $_POST['userNormalizedScore'];
$type = $_POST['type'];
$result = $_POST['result']; // only for receive
$challengePrimaryKey = $_POST['challengePrimaryKey']; // only for receive
$userIdDir = "${FILE_STORAGE_DIR}/{$id}/";
$userFilename = "${userIdDir}/challenge.txt";

$returnValue = new stdClass();
$returnValue->id = $id;
$returnValue->challengedId = $challengedId;
$returnValue->userNormalizedScore = $userNormalizedScore;
$returnValue->type = $type;
$returnValue->seed = $seed;

$challengedIdDir = "${FILE_STORAGE_DIR}/{$challengedId}/";
$challengedUserFilename = "{$challengedIdDir}/challenge.txt";

$globalChallengeIdFilename = "${FILE_STORAGE_DIR}/challengeInfo.txt";

/**
 * Get the next challenge ID before adding the key to the challenge information to store for both players
 *
 * @param [string] $globalChallengeIdFilename - the filename to store for the total challenge ID so we can have unique ids
 * @return void
 */
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


/**
 * Add the challenge to the user id provided
 *
 * @param [int] $challengePrimaryKey -  The primary key of the challenge
 * @param [string] $filename - the filename of the user id
 * @param [string] $currentId - the user id
 * @param [float] $userNormalizedScore - the score this user obtained
 * @param [string] $type - receive/send (the type of the challenge for this user)
 * @param [string] $seed - the seed in this challenge
 * @return void
 */
function addChallenge($challengePrimaryKey, $filename, $currentId, $userNormalizedScore, $type, $seed) {
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
  $challengeObject->{$challengePrimaryKey}->seed = $seed;
  file_put_contents($filename, json_encode($challengeObject)) or die('Unable to save serialized json into file');
  $returnValue = new stdClass();
  $returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
  return $returnValue;
}

/**
 * Update existing challenge information
 *
 * @param [type] $challengePrimaryKey - the challenge primary key 
 * @param [type] $filename - the filename of the user
 * @param [type] $result - the result (win, lose, tie)
 * @return void
 */
function updateChallenge($challengePrimaryKey, $filename, $result) {
  $returnValue = new stdClass();

  if (!file_exists("$filename")) {
    $returnValue = generateResponse($returnValue, 'failed updating challenge', false);
    return $returnValue;
  }

  $challengeObject = json_decode(file_get_contents($filename));
  $challengeObject->{$challengePrimaryKey}->result = $result;
  file_put_contents($filename, json_encode($challengeObject));

  $returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
  return $returnValue;
}

$returnValue = new stdClass();

if ($type === "send") {
  $challengePrimaryKey = getNextChallengeId($globalChallengeIdFilename);
  // add challenge to user that sends the challenge
  $returnValue = addChallenge($challengePrimaryKey, $userFilename, $challengedId, $userNormalizedScore, 'send', $seed);
  if ($returnValue->success) {
    // add challenge to user receiving the challenge
    $returnValue = addChallenge($challengePrimaryKey, $challengedUserFilename, $id, $userNormalizedScore, 'receive', $seed);

    // if the receive insertion is not successful, then we remove the insertion of the send
    if (!$returnValue->success) {
      $challengeArray = json_decode(file_get_contents($userFilename));
      array_shift($challengeArray);
      file_put_contents($userFilename, json_encode($challengeArray));
    }
  }

} else if ($type === "receive") {
    $returnValue = updateChallenge($challengePrimaryKey, $userFilename, $result);
    if ($returnValue->success) {
      if ($result === "win") { 
        $result = "lose" ;
      }
      else if ($result === "lose") { 
        $result = "win" ;
      }
      $returnValue = updateChallenge($challengePrimaryKey, $challengedUserFilename, $result);

      if (!$returnValue->success) {
        $challengeArray = json_decode(file_get_contents($userFilename));
        array_shift($challengeArray);
        file_put_contents($userFilename, json_encode($challengeArray));
      }
    }
} 
echo json_encode($returnValue);

?>
