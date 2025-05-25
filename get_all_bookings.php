
<?php
include "db.php";
$result = $conn->query("SELECT users.name, users.email, slots.slot_name, bookings.booking_time
                        FROM bookings
                        JOIN users ON bookings.user_id = users.id
                        JOIN slots ON bookings.slot_id = slots.id
                        ORDER BY bookings.booking_time DESC");

$bookings = [];

while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode($bookings);
?>
