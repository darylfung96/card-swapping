<?php
include '../returnResponse.php';
include '../common.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$userName = $_GET['id'];
$userFileDir = "${FILE_STORAGE_DIR}/{$id}";
$userFilename = "{$userFileDir}/info.txt";

$conn = createConn();
$sql = "select * from User WHERE userName='$userName'";
$result = $conn->query($sql);
$userInfo = new stdClass();
$returnValue = new stdClass();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $userInfo->id = $userName;
  $userInfo->level = $row['userLevel'];
  $userInfo->timesPlayed = $row['timesPlayed'];
  $userInfo->wins = $row['wins'];
  $userInfo->loses = $row['loses'];
  $userInfo->levelInformation = json_decode($row['levelInformation']);
  $userInfo->isPublic = $row['isPublic'] ? true : false;
  $returnValue->userInfo = $userInfo;
  generateResponse($returnValue, "Successfully obtained user", true);
} else  {
  generateResponse($returnValue, "No user with the name found", false);
}

echo json_encode($returnValue);


// if (file_exists($userFilename)) {
//   $userInfo = file_get_contents($userFilename);
//   $userInfo = json_decode($userInfo);
//   $returnValue->userInfo = $userInfo;
//   $returnValue = generateResponse($returnValue, "Successfully accessed user data", true);
//   echo json_encode($returnValue);
//   return;
// }

// $returnValue = generateResponse($returnValue, "User does not exist.", false);
// echo json_encode($returnValue);

?>
