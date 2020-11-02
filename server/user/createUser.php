<?php
include '../returnResponse.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$userName = $_POST['id'];

$returnValue = new stdClass();
$conn = createConn();

$sql = "INSERT INTO User (userName) VALUES ('$userName');";
if ($conn->query($sql) === TRUE) {
  $userInfo = new stdClass();

  $userInfo->id = $userName;
  $userInfo->level = 1;
  $userInfo->timesPlayed = 0;
  $userInfo->wins = 0;
  $userInfo->loses = 0;
  $userInfo->levelInformation = null;
  $userInfo->isPublic = true;
  $returnValue->userInfo = $userInfo;
  generateResponse($returnValue, "Successfully obtained user", true);
} else {
  generateResponse($returnValue, "No user with the name found", false);
}


echo json_encode($returnValue);
?>
