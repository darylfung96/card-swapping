<?php
include 'returnResponse.php';

$email = $_POST['email'];
$name = substr($email, 0, strpos($email, "@"));
$userFileDir = "fileStorage/{$email}/";
$userFilename = "{$userFileDir}/info.txt";

$userInfo->email = $email;
$userInfo->name = $name;

$returnValue->userInfo = $userInfo;
$returnValue->msg = "";

if (file_exists("fileStorage/{$email}/")) {
  $userInfo = file_get_contents($userFilename);
  $userInfo = json_decode($userInfo);
  $returnValue->userInfo = $userInfo;
  $returnValue = generateResponse($returnValue, "User already exist, accessing user data", true);
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
