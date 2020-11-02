<?php
include '../returnResponse.php';
include "../connection.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');


$userInfo = json_decode($_POST['userInfo']);
$userName = $userInfo->id;
$timesPlayed = (int)$userInfo->timesPlayed;
$userLevel = (int)$userInfo->level;
$isPublic = $userInfo->isPublic ? 1 : 0;
$levelInformation = json_encode($userInfo->levelInformation);
$wins = (int)$userInfo->wins;
$loses = (int)$userInfo->loses;

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
?>
