<?php
// Check for empty fields
if(empty($_POST['name'])  	||
   empty($_POST['email']) 	||
   empty($_POST['phone'])	||
   empty($_POST['subject'])	||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments provided!";
	return false;
   }
	
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$subject = strip_tags(htmlspecialchars($_POST['subject']));
$message = strip_tags(htmlspecialchars($_POST['message']));
	
// Create the email and send the message
$to = 'sales@all4homee.com'; // Add your email address - This is where the form will send a message to.
$email_subject = "New inquiry from: $name - Subject: $subject";
$email_body = "You have received a new message from the contact form on all4homee.com website.\n\n".
              "Message Details:\n\n".
              "Name: $name\n\n".
              "Email: $email_address\n\n".
              "Phone: $phone\n\n".
              "Subject: $subject\n\n".
              "Message:\n$message";
              
$headers = "From: noreply@all4homee.com\n"; // This is the email address the generated message will be from.
$headers .= "Reply-To: $email_address";	

if(mail($to,$email_subject,$email_body,$headers)) {
    echo "success";
} else {
    echo "Message could not be sent. Please try again later.";
}
return true;			
?>