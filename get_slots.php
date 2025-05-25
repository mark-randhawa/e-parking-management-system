<?php
include "db.php";
$res = $conn->query("SELECT * FROM slots");
$slots = [];
while ($row = $res->fetch_assoc()) {
  $slots[] = $row;
}
echo json_encode($slots);
?>
