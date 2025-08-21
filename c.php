<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json'); 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name    = $_POST['name'] ?? '';
    $email   = $_POST['email'] ?? '';
    $option  = $_POST['option'] ?? '';
    $message = $_POST['message'] ?? '';

    require 'phpmailer/Exception.php';
    require 'phpmailer/PHPMailer.php';
    require 'phpmailer/SMTP.php';

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host       = 'mail.apexdigitech.in';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'sonu.pandey@apexdigitech.in';
        $mail->Password   = 'Apex@onu@2025#';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Email content
        $mail->setFrom('sonu.pandey@apexdigitech.in', 'Creative Soul');
        $mail->addAddress('contactsonupandey@gmail.com',"Creative Soul");
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = 'Website Enquiry Of Creative Soul';
        $mail->Body    = "
            <strong>Sender Name:</strong> $name<br>
            <strong>Email:</strong> $email<br>
            <strong>Service Interested In:</strong> $option<br>
            <strong>Message:</strong><br>$message
        ";

        $mail->send();

        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Mailer Error: ' . $mail->ErrorInfo
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
