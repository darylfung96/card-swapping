<?php
include "connection.php";

$conn = new mysqli($host, $username, $password);

if (mysqli_connect_error()) {
  die("Database connection failed: " . mysqli_connect_error());
}

createDB($conn);
useDB($conn);
createTable($conn);
echo "successful connection\n";
?>