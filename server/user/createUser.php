<?php
include '../returnResponse.php';
include '../common.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$userName = $_POST['id'];
// $userFileDir = "${FILE_STORAGE_DIR}/{$id}/";
// $userFilename = "{$userFileDir}/info.txt";

$returnValue = new stdClass();
generateResponse($returnValue, "successfully created user in database", true);
$conn = createConn();
$sql = "INSERT INTO User (userName) VALUES ('$userName');";
if ($conn->query($sql) === TRUE) {
  echo "created user successfully\n";
} else {
  die("Error creating user: " . $conn->error);
  generateResponse($returnValue, $conn->error, true);
}

echo json_encode($returnValue);



// $userInfo->id = $id;
// $userInfo->timesPlayed = 0;
// $userInfo->level = 1;
// $userInfo->isPublic = true;

// $returnValue->userInfo = $userInfo;
// $returnValue->msg = "";

// if (file_exists("$userFileDir")) {
//   $returnValue = generateResponse($returnValue, "ID already exist", false);
//   echo json_encode($returnValue);
// return;
// }

// // create file
// mkdir($userFileDir, 0700, true);
// $encodedUserInfo = json_encode($userInfo);
// file_put_contents($userFilename, $encodedUserInfo) or die('unable to serialize userinfo to file');
// $returnValue = generateResponse($returnValue, "successfully created user in database", true);
// echo json_encode($returnValue);
// ?>
