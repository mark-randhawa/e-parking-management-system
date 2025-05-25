
<?php
include "db.php";
$booking_id = $_POST['booking_id'];

// Get slot ID before deleting booking
$res = $conn->query("SELECT slot_id FROM bookings WHERE id = $booking_id");
if ($res->num_rows > 0) {
  $slot = $res->fetch_assoc()['slot_id'];
  $conn->query("UPDATE slots SET is_booked = 0 WHERE id = $slot");
  $conn->query("DELETE FROM bookings WHERE id = $booking_id");
  echo "Checked out and slot freed.";
} else {
  echo "Booking not found.";
}
?>
