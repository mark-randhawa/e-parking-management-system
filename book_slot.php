<?php
include "db.php";
$user_id = $_POST['user_id'];
$slot_id = $_POST['slot_id'];

// Check if slot is already booked
$check = $conn->query("SELECT * FROM slots WHERE id=$slot_id AND is_booked=1");
if ($check->num_rows > 0) {
  echo "Slot already booked!";
  exit;
}

// Book the slot
$conn->query("UPDATE slots SET is_booked=1 WHERE id=$slot_id");
$conn->query("INSERT INTO bookings (user_id, slot_id, booking_time) VALUES ($user_id, $slot_id, NOW())");

echo "Slot booked successfully!";
?>
