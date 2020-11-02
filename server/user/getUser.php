<?php
include '../returnResponse.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$userName = $_GET['id'];

$conn = createConn();
$sql = "select * from User WHERE userName='$userName'";
$result = $conn->query($sql);
$userInfo = new stdClass();
$returnValue = new stdClass();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $userInfo->id = $userName;
  $userInfo->level = (int)$row['userLevel'];
  $userInfo->timesPlayed = (int)$row['timesPlayed'];
  $userInfo->wins = (int)$row['wins'];
  $userInfo->loses = (int)$row['loses'];
  $userInfo->levelInformation = json_decode($row['levelInformation']);
  $userInfo->isPublic = $row['isPublic'] ? true : false;
  $returnValue->userInfo = $userInfo;
  generateResponse($returnValue, "Successfully obtained user", true);
} else  {
  generateResponse($returnValue, "No user with the name found", false);
}

echo json_encode($returnValue);
?>
