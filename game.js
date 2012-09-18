/* DigMan Game JS File */

var width=16;
var size = 32;
var init_h = 50;
var difficulty;
var running = false;
var ready = false;

var depth = 0;
var last = 0;
var speed = 20;

var player = {score:0,health:0,x:0,y:0,health_v:0};
var map = Array();

function init()
{
	difficulty = 1;
	map = Array();
	depth = 0;
	last = 0;
	ready = true;
	
	
	for(x=0;x<init_h;x++)
	{
		addLine(x,difficulty);
	}
	
	document.body.onkeydown = key;
	document.body.onmousedown = start;
	document.getElementById('left').onmousedown = moveLeft;
	document.getElementById('right').onmousedown = moveRight;
	
	message("Press Any Key !<br /><small>Grab <img src='img/gold.png' style='vertical-align:top'>&nbsp;&nbsp;Avoid <img src='img/trap.png' style='vertical-align:top'></small>");	
}

function message(m)
{
	if(m)
	{
		document.getElementById('message').innerHTML = m;
		document.getElementById('message').style.display = 'block';
	}
	else
	{
		document.getElementById('message').style.display = 'none';
	}
}

function start()
{
	document.body.onmousedown = '';
	message();
	player.score = 0;
	player.health = 100;
	player.x = 1;
	player.y = Math.floor(width/2);
	running = true;
	ready = false;
	tick();
}

function addLine(x,d)
{
	last = x;
	
	map[x] = Array();
	for(y=0;y<width;y++)
	{
		r = Math.floor(Math.random() * 50);
		if(Math.min(r < (difficulty*2),40) && x>8)
		{
			setBlock(x,y,3);	/* It's a trap */
		}
		else if(r > 48)	/* Gold */
		{
			setBlock(x,y,2);	/* Shiny Gold */
		}
		else
		{
			setBlock(x,y,1);	/* Stone */
		}
	}
}

function serialize()
{
	return {d:depth,l:last,p:player};
}

function unseralize(data)
{
	depth = data.d;
	last = data.last;
	player = data.p;
}

function draw()
{
	s = document.getElementById('scroll');
	s.style.top = (0 - depth)+'px';
	
	for(x=0;x<last;x++)
	{
		for(y=0;y<width;y++)
		{
			setBlock(x,y,getBlock(x,y));
		}
	}
	
	p = document.getElementById('player');
	p.style.left = (size * player.y)+'px';
	p.style.top = (size * player.x)+'px';
	
	hud();
}

function tick()
{
	depth+=3;
	s = document.getElementById('scroll');
	s.style.top = (0 - depth)+'px';
	
	if(player.health_v<0)
	{
		player.health_v = 0;
		document.getElementById('pain').style.display = 'block';
	}
	if(player.health_v>0)
	{
		player.health_v = 0;
		document.getElementById('heal').style.display = 'block';
	}
	else
	{
		document.getElementById('heal').style.display = 'none';
		document.getElementById('pain').style.display = 'none';
	}
	
	if(Math.floor(depth/size)+50 > last)
	{
		console.log("Adding Line");
		addLine(last+1);
		if(last%20==0)
		{
			difficulty++;
		}
		
		player.score+=5;
		checkDig();
		
	}
	
	p = document.getElementById('player');
	p.style.left = (size * player.y)+'px';
	p.style.top = (size * player.x)+'px';
	
	hud();
	
	if(player.health <= 0)
	{
		running = false;
		message("GAME OVER !<br /><input type='button' value='Brag it!' onclick='sendBrag();'></input>&nbsp;<input type='button' value='Dig again!' onclick='init();'></input><br /><small>Your Score : "+player.score+"</small>");
		highScore();
	}
	
	if(running)
	{
		window.setTimeout(tick,speed);
	}
}

function checkDig()
{
	dig(last-49+player.x,player.y);
}

function hud()
{
	document.getElementById('h_h').innerHTML = player.health;
	document.getElementById('h_s').innerHTML = player.score;
	document.getElementById('h_l').innerHTML = difficulty;
}

function dig(x,y)
{
	b = getBlock(x,y);
	if(b==2)	/* Oh yes */
	{
		player.score+=50;
		if(player.health < 100)
		{
			player.health+=2;
			player.health_v = 1;
		}
		setBlock(x,y,0);
	}
	else if(b==3)	/* Oh no */
	{
		player.health-=20;
		player.health_v = -1;
		document.getElementById('pain').style.display = 'block';
		setBlock(x,y,0);
	}
	else if(b==1)
	{
		setBlock(x,y,0);
	}
}

function moveLeft()
{
	if(player.y>0)
	{
		player.y--;
		checkDig();
	}
}

function moveRight()
{
	if(player.y<width-1)
	{
		player.y++;
		checkDig();
	}
}

function setBlock(x,y,b)
{
	d = document.getElementById('b_'+x+'_'+y);
	if(!d)
	{
		d = document.createElement('div');
		d.id = 'b_'+x+'_'+y;
		d.style.height = size+'px';
		d.style.width = size+'px';
		d.style.top = x*size+'px';
		d.style.left = y*size+'px';
		s = document.getElementById('scroll');
		s.appendChild(d);
	}
	map[x][y] = b;
	d.className = 'b'+b;
}

function getBlock(x,y)
{
	return map[x][y];
}

function key(e)
{
	if(running)
	{
		if(e.keyCode==37)
		{
			moveLeft();
		}
		if(e.keyCode==39)
		{
			moveRight();
		}
	}
	else if(ready)
	{
		start();
	}
}