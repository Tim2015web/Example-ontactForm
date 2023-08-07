<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/Exception.php';

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('ru', 'phpmailer/language');
    $mail->IsHTML(true);

    // От кого письмо
    $mail->setFrom('mail@ilyagreen.ru', 'Фрилансер по жизни');
    // Кому отправить
    $mail->addAddress('tim2015web@gmail.com');
    // Тема письма
    $mail->Subject = 'Привет! Письмо';

    // Пол
    $gender = "Мужской";
    if($_POST['gender'] == "female"){
        $gender = "Женский";
    }

    // Тело письма
    $body = '<h1>Заголовок H1</h1>';

    if(trim(!empty($_POST['name']))){
        $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
    }

    if(trim(!empty($_POST['email']))){
        $body.='<p><strong>E-Mail:</strong> '.$_POST['email'].'</p>';
    }

    if(trim(!empty($_POST['gender']))){
        $body.='<p><strong>Пол:</strong> '.$gender.'</p>';
    }

    if(trim(!empty($_POST['age']))){
        $body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
    }

    if(trim(!empty($_POST['message']))){
        $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
    }

    // Прекрепить файл
    if (!empty($_FILES['image']['tmp_name'])){
        // Путь загрузки файла
        $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
        // Загружаем файл
        if (copy($_FILES['image']['tmp_name'], $filePath)){
            $fileAttach = $filePath;
            $body.='<p><strong>Фото в приложении</strong>';
            $mail->addAttachment($fileAttach);
        }
    }

    $mail->Body = $body;

    // Отправляем
    if (!$mail->send()){
        $message = "Ошибка";
    } else {
        $message = "Данные отправлены!";
    }

    $response = ['message' => $message];

    header('Content-type: aplication/json');
    echo json_encode($response);
?>