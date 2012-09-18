<?

require('lib/facebook.php');

$app_id = '495216077162685';
$app_secret = '4b7a16b95a524c574401be1423e7a245';
$app_namespace = 'dig-man';
$app_url = 'http://apps.facebook.com/'.$app_namespace.'/';
$scope = 'publish_actions';

$facebook = new Facebook(array('appId'=>$app_id,'secret'=>$app_secret));

$user = $facebook->getUser();

if(!$user)
{
    $loginUrl = $facebook->getLoginUrl(array('scope' => $scope,'redirect_uri' => $app_url));
    die("<script> top.location.href='".$loginUrl."'</script>");
}

?>

<html>
<head>
	<link href="game.css" media="all" rel="stylesheet" />
	<script src="game.js"></script>
	<script src="prototype.js"></script>
	<script src="http://connect.facebook.net/en_US/all.js"></script>
	<script>
	
	var appId = '495216077162685';
	var uid;

	FB.init({appId: appId,cookie: true,});
	FB.getLoginStatus(function(response) {uid = response.authResponse.userID ? response.authResponse.userID : null;});
	
	function fbCallback(response)
	{
		console.log(response);
	}
	
	function sendBrag()
	{
		var messageStr = 'I digged down to ' + player.score + 'pts in DigMan!';

		FB.ui({ method: 'feed',
		caption: messageStr,
		picture: 'http://digman.utelfr.com/img/player.gif',
		name: 'Dig with DigMan',
		link: 'http://apps.facebook.com/dig-man'
	  }, fbCallback);
	}
	
	
	function highScore()
	{
		FB.api('me/scores','post',{score: player.score}, fbCallback);
	} 
	</script>
</head>
<body>
	<div id="s_container"><div id="hud">Health : <span id="h_h">0</span> - Score : <span id="h_s">0</span> - Level : <span id="h_l">0</span></div>
		<div id="scroll"></div>
		<div id="player"></div>
		<div id="pain" style="display:none;"></div>
		<div id="heal" style="display:none;"></div>
		<div id="message"></div>
	</div>
	<div id="left"></div>
	<div id="right"></div>
	<script>init();</script>
</body>
</html>