<?php
if(!$_POST) exit;

    $to 	  = 'someemail@somedomain.com'; #Replace your email id...
	$fname	  = $_POST['txtfname'];
	$email    = $_POST['txtemail'];
	$ddate  = $_POST['txtddate'];
	$dtime  = $_POST['txtdtime'];
	$nopersons  = $_POST['cmbpersons'];
    $comment  = $_POST['txtmessage'];
        
	if(get_magic_quotes_gpc()) { $comment = stripslashes($comment); }

	 $e_subject = 'New Reservation has been Submitted';

	 $msg  = "First Name: $fname\r\n\n";
	 $msg  .= "Email Address: $email\r\n\n";
	 $msg  .= "Dinner Date: $ddate\r\n\n";
	 $msg  .= "Dinner Time: $dtime\r\n\n";
	 $msg  .= "No.of Persons: $nopersons\r\n\n";
	 $msg  .= "Optional Message: $comment\r\n\n";	 
	 $msg .= "-------------------------------------------------------------------------------------------\r\n";
								
	 if(@mail($to, $e_subject, $msg, "From: $email\r\nReturn-Path: $email\r\n"))
	 {
		 echo "<span class='success-box'>Thanks for Contacting Us, We will call back to you soon.</span>";
	 }
	 else
	 {
		 echo "<span class='error-box'>Sorry your message not sent, Try again Later.</span>";
	 }
?>