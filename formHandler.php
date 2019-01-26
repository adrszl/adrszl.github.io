<?php
require("sendgrid-php/sendgrid-php.php");

$sendGridAPIKey = "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";

if ($_POST["emailAdress"] === "") {
  $error = "no-email";
  header("Location: index.html?error=".$error."#contactForm");
  // $error = "";
  exit;
} elseif ($_POST["companyName"] === "") {
  $error = "no-name";
  header("Location: index.html?error=".$error."#contactForm");
  // $error = "";
  exit;
} elseif ($_POST["messageContent"] === "") {
  $error = "no-content";
  header("Location: index.html?error=".$error."#contactForm");
  // $error = "";
  exit;
} else {
  // the message
  $emailAd = $_POST["emailAdress"];
  $name = $_POST["companyName"];
  $message = $_POST["messageContent"];

  // $fullMessage = "Wiadomość z portfolio:\nAdres e-mail nadawcy: ".$emailAd."\nNazwa: ".$name."\n\nTreść wiadomości:\n".$message;

  /* SENDGRID */
// If not using Composer, uncomment the above line and
// download sendgrid-php.zip from the latest release here,
// replacing <PATH TO> with the path to the sendgrid-php.php file,
// which is included in the download:
// https://github.com/sendgrid/sendgrid-php/releases
  $email = new \SendGrid\Mail\Mail();
  $email->setFrom($emailAd, "Example User");
  $email->setSubject("Wiadomosc z portfolio");
  $email->addTo("adrian95999@gmail.com", "Example User");
  $email->addContent("text/plain", $message);
  // $email->addContent(
  //     "text/html", "<strong>and easy to do anywhere, even with PHP</strong>"
  // );
  $sendgrid = new \SendGrid(getenv($sendGridAPIKey));
  try {
      $response = $sendgrid->send($email);
      // print $response->statusCode() . "\n";
      // print_r($response->headers());
      // print $response->body() . "\n";
      // header("Location: index.html?error=".$response."#contactForm");
      header("Location: index.html?message=success#contactForm");
      exit;
  } catch (Exception $e) {
      // echo 'Caught exception: '. $e->getMessage() ."\n";
      // header("Location: index.html?error=".$e."#contactForm");
      header("Location: index.html#contactForm");
      exit;
  }

// use wordwrap() if lines are longer than 70 characters
// $msg = wordwrap($msg,70);

// send email
// mail("adrian95999@gmail.com","E-mail z portfolio",$fullMessage);
//   exit;
}

// if ( isset($_POST['who']) && isset($_POST['pass'])) {
//   $at_sign = strpos($_POST['who'], "@");
//   if ( strlen($_POST['who']) < 1 || strlen($_POST['pass']) < 1 ) {
//       $failure = true;
//       $error = "<p style = \"color:red\">Email and password are required</p>";
//   }
//   elseif ($at_sign === false) {
//       $failure = true;
//       $error = "<p style = \"color:red\">Email must have an at-sign (@)</p>";
//   } else {
//       $passwordCheck = $_POST["pass"];
//       $passwordCheck = $salt.$passwordCheck;
//       $check = hash('md5', $passwordCheck);
//       if ( $check != $stored_hash ) {
//           $failure = true;
//           error_log("Login fail ".$_POST['who']." $check");
//           $error = "<p style = \"color:red\">Incorrect password</p>";
//       } else {
//           // Redirect the browser to autos.php
//           error_log("Login success ".$_POST['who']);
//           header("Location: autos.php?name=".urlencode($_POST['who']));
//           return;
//       }
//   }
// }
  ?>
