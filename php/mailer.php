<?php

$name = $_POST['name'];
$email = $_POST['email'];
$msg = $_POST['msg'];

if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['msg'])) {
	header('Location: ../');
	exit;
}

if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $fh = fopen('./email.txt', 'a');
    fwrite($fh, $name . ', ' . $email . ', ' . $msg . "\r\n");
    fclose($fh);
} else {
    echo 'invalid-email';
    exit;
}

$my = array('email' => 'msumenge@hotmail.com', 'name' => 'Maryo J Sumenge');
require_once('./PHPMailer/PHPMailerAutoload.php');

$mail = new PHPMailer;
#	$mail->SMTPDebug = 3;

$mail->isSMTP();
$mail->Host = 'sg2plcpnl0006.prod.sin2.secureserver.net';
$mail->SMTPAuth = true;
$mail->Username = 'admin@maryo.info';
$mail->Password = '1931995m';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465; //587

$mail->setFrom($_POST['email'], $_POST['name']);
$mail->addAddress($my['email']);
$mail->addReplyTo($_POST['email'], $_POST['name']);

#$mail->addAttachment('');

$mail->isHTML(true);
$mail->Subject = 'maryo.info Contact form';
$mail->Body    = $msg;
$mail->AltBody = $msg;


if($mail->send()) {
	echo 'sent';
} else {
	$fh = fopen('./error_log.txt', 'a');
	$error = $mail->ErrorInfo . "\r\n";
	fwrite($fh, $error);
	fclose($fh);
	echo 'error';
}

?>