<?php
include '../returnResponse.php';
include '../common.php';
include "../connection.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');


// $userInfo = json_decode($_POST['userInfo']);
$userInfo = json_decode('{"id":"a","timesPlayed":16,"level":3,"isPublic":true,"levelInformation":{"1":[6,6,6,6,6],"2":[6,6,6,6,6],"3":[6,6,6,6]},"wins":0,"loses":0}');
$userName = $userInfo->id;
$timesPlayed = $userInfo->timesPlayed;
$userLevel = $userInfo->level;
$isPublic = $userInfo->isPublic ? 1 : 0;
$levelInformation = json_encode($userInfo->levelInformation);
$wins = $userInfo->wins;
$loses = $userInfo->loses;

$conn = createConn();
$sql = "UPDATE User SET timesPlayed=$timesPlayed, userLevel=$userLevel, " .
"isPublic=$isPublic, wins=$wins, loses=$loses, levelInformation='$levelInformation' WHERE userName='$userName' ;";
$returnValue = new stdClass();
if ($conn->query($sql) === TRUE) {
  $returnValue = generateResponse($returnValue, "user updated successfully", true);
} else {
  $returnValue = generateResponse($returnValue, "Error updating user: " . $conn->error, false);
}

echo json_encode($returnValue);

// $userFileDir = "{$FILE_STORAGE_DIR}/{$userInfo->id}";
// $userFilename = "{$userFileDir}/info.txt";

// if (file_exists($userFilename)) {
//   // put file content
//   file_put_contents($userFilename, json_encode($userInfo)) or die('Unable to update user information');

//   $returnValue->userInfo = $userInfo;
//   $returnValue = generateResponse($returnValue, "Successfully accessed user data", true);
//   echo json_encode($returnValue);
// return;
// }

// $returnValue = generateResponse($returnValue, "User does not exist.", false);
// echo json_encode($returnValue);

?>
