<?php
$host = "localhost";
$username = "cardswapusername";
$password = "cardswappassword";
$database = "cardSwapDB";

function createConn() {
  global $host, $username, $password, $database;

  $conn = new mysqli($host, $username, $password, $database);

  if (mysqli_connect_error()) {
    die("Database connection failed: " . mysqli_connect_error());
  }

  return $conn;
}


function createDB($conn) {
  global $database;

  $sql = "CREATE DATABASE IF NOT EXISTS $database;";

  if ($conn->query($sql) === TRUE) {
    echo "create database successfully\n";
  } else {
    die("Error creating database " . $conn->error);
  }
}

function useDB($conn) {
  global $database;
  $sql = "USE $database;";

  if ($conn->query($sql) === TRUE) {
    echo "selected database successfully\n";
  } else {
    die("Error selecting database " . $conn->error);
  }
}

function createTable($conn) {
  // create user table
  $sql = "CREATE TABLE IF NOT EXISTS User (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    timesPlayed INT DEFAULT 0,
    userLevel INT DEFAULT 1,
    wins INT DEFAULT 0,
    loses INT DEFAULT 0,
    levelInformation VARCHAR(255),
    isPublic BOOLEAN NOT NULL DEFAULT 1,
    UNIQUE (userName)
    );";
  if ($conn->query($sql) === TRUE) {
    echo "created user table successfully\n";
  } else {
    die("Error creating user table " . $conn->error);
  }

  // create challenge table
  $sql = "CREATE TABLE IF NOT EXISTS Challenge (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    senderName VARCHAR(30) NOT NULL,
    receiverName VARCHAR(30) NOT NULL,
    userNormalizedScore FLOAT NOT NULL,
    seed VARCHAR(10) NOT NULL,
    result VARCHAR(10)
    );";
  if ($conn->query($sql) === TRUE) {
    echo "created challenge table successfully\n";
  } else {
    die("Error creating challenge table " . $conn->error);
  }

  // create leaderboard table
  $sql = "CREATE TABLE IF NOT EXISTS Leaderboard (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    leaderboardType VARCHAR(30) NOT NULL, 
    leaderboardValue FLOAT NOT NULL
    );";
  if ($conn->query($sql) === TRUE) {
    echo "created leaderboard table successfully\n";
  } else {
    die("Error creating leaderboard table " . $conn->error);
  }
}
?>