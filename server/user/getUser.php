<?php
include '../returnResponse.php';
include '../common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$id = $_GET['id'];
$userFileDir = "${FILE_STORAGE_DIR}/{$id}";
$userFilename = "{$userFileDir}/info.txt";

if (file_exists($userFilename)) {
  $userInfo = file_get_contents($userFilename);
  $userInfo = json_decode($userInfo);
  $returnValue->userInfo = $userInfo;
  $returnValue = generateResponse($returnValue, "Successfully accessed user data", true);
  echo json_encode($returnValue);
  return;
}

$returnValue = generateResponse($returnValue, "User does not exist.", false);
echo json_encode($returnValue);

?>
