<?php
include '../returnResponse.php';
include '../connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// leaderboardInfo should contain this format
// leaderBoardInfo = {timesPlayed: {id1: 5, id2: 12, id3: 1}, highestLevel: {id1: 1, id2: 2, ...}, winningRate: {id1: 0.5, id2: 0.6, ...}}

$type = $_GET["type"];

$conn = createConn();
$sql = "select * from Leaderboard where leaderboardType='$type' order by leaderboardValue DESC limit 100";
$result = $conn->query($sql);

$leaderboardObject = new stdClass();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $userName = $row['userName'];
    $value = $row['leaderboardValue'];

    $leaderboardObject->{$userName} = $value;
  }
}

$returnValue = new stdClass();
$returnValue->leaderboard = $leaderboardObject;
$returnValue = generateResponse($returnValue, "successfully obtain leaderboard of $type", true);
echo json_encode($returnValue);
?>
