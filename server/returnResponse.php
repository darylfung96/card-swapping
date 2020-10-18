<?php

function generateResponse($returnValue, $msg, $success) {
  $returnValue->success = $success;
  $returnValue->msg = $msg;
  return $returnValue;
}

?>