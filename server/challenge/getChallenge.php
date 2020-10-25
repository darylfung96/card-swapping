<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_GET['id'];
$idDir = "${FILE_STORAGE_DIR}/{$id}/";
$filename = "{$idDir}/challenge.txt";

$challengeObject = new stdClass();
if (file_exists("$filename")) {
  // if file exist
  $challengeObject = json_decode(file_get_contents($filename));
}
$challengeArray = array_values((array)$challengeObject);
$challengeArray = array_reverse($challengeArray);

$returnValue = new stdClass();
$returnValue->challenges = $challengeArray; 
$returnValue = generateResponse($returnValue, 'Successfully added challenge', true);
echo json_encode($returnValue);
?>
