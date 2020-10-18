<?php
include 'returnResponse.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_POST['id'];
$userFileDir = "fileStorage/{$id}/";
$userFilename = "{$userFileDir}/info.txt";

$userInfo->id = $id;
$userInfo->timesPlayed = 0;
$userInfo->level = 1;

$returnValue->userInfo = $userInfo;
$returnValue->msg = "";

if (file_exists("fileStorage/{$id}/")) {
  $returnValue = generateResponse($returnValue, "ID already exist", false);
  echo json_encode($returnValue);
return;
}

// create file
mkdir($userFileDir, 0700, true);
$encodedUserInfo = json_encode($userInfo);
file_put_contents($userFilename, $encodedUserInfo) or die('unable to serialize userinfo to file');
$returnValue = generateResponse($returnValue, "successfully created user in database", true);
echo json_encode($returnValue);
?>
