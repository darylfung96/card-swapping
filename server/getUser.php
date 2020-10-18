<?php
include 'returnResponse.php';

$email = $_GET['email'];
$name = substr($email, 0, strpos($email, "@"));
$userFileDir = "fileStorage/{$email}/";
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
