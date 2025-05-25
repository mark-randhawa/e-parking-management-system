
<?php
include "db.php";

$user_id = $_GET['user_id'];

$result = $conn->query("SELECT bookings.id AS booking_id, slots.slot_name, bookings.booking_time, bookings.is_checked_in 
                        FROM bookings 
                        JOIN slots ON bookings.slot_id = slots.id 
                        WHERE bookings.user_id = $user_id 
                        ORDER BY bookings.booking_time DESC");

$history = [];

while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

header('Content-Type: application/json');
echo json_encode($history);
?>
