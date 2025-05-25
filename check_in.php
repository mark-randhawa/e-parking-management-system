
<?php
include "db.php";
$booking_id = $_POST['booking_id'];
$conn->query("UPDATE bookings SET is_checked_in = 1 WHERE id = $booking_id");
echo "Checked in successfully!";
?>
