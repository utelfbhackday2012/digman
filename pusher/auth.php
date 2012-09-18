<?php
require('Pusher.php');

$pusher = new Pusher('792e8b138073942e3005', '6ad4631498814ab93211', '27936');
echo $pusher->socket_auth($_POST['channel_name'],$_POST['socket_id']);
?>
