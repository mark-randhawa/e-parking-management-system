
<?php
include "db.php";
$email = $_POST['email'];
$pass = $_POST['password'];

$res = $conn->query("SELECT * FROM users WHERE email='$email'");
if ($res->num_rows > 0) {
  $row = $res->fetch_assoc();
  if (password_verify($pass, $row['password'])) {
    $row['status'] = "success";
    $row['is_admin'] = ($email == 'admin@eparking.com') ? true : false;
    echo json_encode($row);
  } else {
    echo json_encode(["status" => "fail"]);
  }
} else {
  echo json_encode(["status" => "fail"]);
}
?>
