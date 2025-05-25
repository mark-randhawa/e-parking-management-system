<?php
include "db.php";
$name = $_POST['name'];
$email = $_POST['email'];
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT);
$conn->query("INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$pass')");
echo "Registered";
?>
