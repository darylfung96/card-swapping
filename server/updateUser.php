<?php
include 'returnResponse.php';

$userInfo = json_decode($_POST['userInfo']);  
$userFileDir = "fileStorage/{$userInfo->id}";
$userFilename = "{$userFileDir}/info.txt";

if (file_exists($userFilename)) {
  // put file content
  file_put_contents($userFilename, json_encode($userInfo)) or die('Unable to update user information');

  $returnValue->userInfo = $userInfo;
  $returnValue = generateResponse($returnValue, "Successfully accessed user data", true);
  echo json_encode($returnValue);
return;
}

$returnValue = generateResponse($returnValue, "User does not exist.", false);
echo json_encode($returnValue);

?>
