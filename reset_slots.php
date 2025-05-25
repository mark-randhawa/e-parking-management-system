
<?php
include "db.php";
$conn->query("UPDATE slots SET is_booked = 0");
$conn->query("DELETE FROM bookings");
echo "Slots reset successfully.";
?>
