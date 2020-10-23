<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['userId'];
$challengedId = $_POST['challengedId'];
$userNormalizedScore = $_POST['userNormalizedScore'];
$challengedIdDir = "${FILE_STORAGE_DIR}/{$challengedId}/";
$challengedUserFilename = "{$challengedIdDir}/challenge.txt";

$challengeArray = [];
if (file_exists("$challengedUserFilename")) {
  // if file exist
  $challengeArray = json_decode(file_get_contents($challengedUserFilename));
}
$challengeObject = new stdClass();
$challengeObject->{$id} = $userNormalizedScore;
array_push($challengeArray, $challengeObject);
file_put_contents($challengedUserFilename, json_encode($challengeArray)) or die('Unable to save serialized json into file');
$returnValue = new stdClass();
$returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
echo json_encode($returnValue);
?>
