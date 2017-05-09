var can;
var ctx;
var canWidth;
var canHeight;
var lastTime;
var deltaTime;
var gameXCount;
var gameYCount;
var gameSquWidth;
var gameSpeed;
var DirectionEnum;
var map;
var snack;
var food;
var score;

document.body.onload = game;

function game(){
	Start();
	Update();
}

function Start(){
	gameXCount=20;
	gameYCount=12;
	gameSquWidth=40;
	gameSpeed = 400;
	DirectionEnum= {'up':0,'right':1,'down':2,'left':3};

	can=document.getElementById("canvas");
	ctx=can.getContext('2d');

	canWidth=can.width;
	canHeight=can.height;

	//mouse listener
	window.addEventListener('keydown',doKeyDown,true);

	lastTime=Date.now()-gameSpeed;
	deltaTime=0;
	score=0;

	map=new mapObj();
	map.init();
	snack=new snackObj();
	snack.init();
	food=new foodObj();
	
	food.init();
}
function Update(){
	//setInterval,settimeout 依据机器性能确定循环
	window.requestAnimFrame(Update);
	//祯间隔时间
	var now=Date.now();
	
	deltaTime=now-lastTime;
	map.draw();
	snack.collision();

	snack.draw();
	food.draw();

	scoreDraw();
	lastTime=now;
}

function doKeyDown(e) {
	var keyID = e.keyCode ? e.keyCode :e.which;
	if(keyID === 38 || keyID === 87)  { // up arrow and W
		if(snack.direction==DirectionEnum.down){
			return;
		}
		snack.direction=DirectionEnum.up
		console.log("up");
	}
	if(keyID === 39 || keyID === 68)  { // right arrow and D
		if(snack.direction==DirectionEnum.left){
			return;
		}
		snack.direction=DirectionEnum.right
		console.log("right");
	}
	if(keyID === 40 || keyID === 83)  { // down arrow and S
		if(snack.direction==DirectionEnum.up){
			return;
		}
		snack.direction=DirectionEnum.down
		console.log("down");
	}
	if(keyID === 37 || keyID === 65)  { // left arrow and A
		if(snack.direction==DirectionEnum.right){
			return;
		}
		snack.direction=DirectionEnum.left
		console.log("left");
	}
}	

var mapObj=function(){
	this.xCount;
	this.yCount;
	this.squWidth;
	this.bgColor;
}
mapObj.prototype.init=function () {
	this.xCount=gameXCount;
	this.yCount=gameYCount;
	this.squWidth=gameSquWidth;
	this.bgColor="#333";
}	

mapObj.prototype.draw=function () {
	ctx.save();

	ctx.fillStyle=this.bgColor;
	ctx.strokeStyle='white';

	ctx.fillRect(0,0,this.squWidth*this.xCount,this.squWidth*this.yCount);

	for(var i=0; i<this.xCount;i++){
		for(var j=0;j<this.yCount;j++){
			ctx.strokeRect(i*this.squWidth,j*this.squWidth,
				this.squWidth,this.squWidth);
		}
	}
	ctx.stroke();
	ctx.restore();	
}
var snackObj=function(){
	this.x=[];
	this.y=[];
	this.timer;
	this.isAlive;
	this.direction;
	this.squWidth;
	this.imgHead=new Image();
	this.imgBoby=new Image();
}
snackObj.prototype.init=function(){
	this.x=[9,8,7,6,5];
	this.y=[6,6,6,6,4];
	this.timer=0;
	this.isAlive=true;
	this.direction=DirectionEnum.up;
	this.squWidth=gameSquWidth;
	this.imgBoby.src='img/body.png';
}
snackObj.prototype.draw=function(){
	ctx.save();
	if(this.isAlive==true){
		this.timer+=deltaTime;
		if(this.timer>gameSpeed){
			for(var i=this.x.length-1;i>0;--i){
				this.x[i]=this.x[i-1];
				this.y[i]=this.y[i-1];
			}
			if(this.direction==DirectionEnum.up){
					this.y[0]--;
					this.imgHead.src='img/head0.png';
		
			}else if(this.direction==DirectionEnum.right){
					this.x[0]++;
					this.imgHead.src='img/head1.png';
				
			}else if(this.direction==DirectionEnum.down){
					this.y[0]++;
					this.imgHead.src='img/head2.png';
				
			}else if(this.direction==DirectionEnum.left){
					this.x[0]--;
					this.imgHead.src='img/head3.png';
			}
			this.timer=0;
		}
	}else{
		
	}
	
	for(var i=0;i<this.x.length;i++){
		if(i==0){
			ctx.drawImage(this.imgHead,this.x[0]*this.squWidth,this.y[0]*this.squWidth);
		}else{
			ctx.drawImage(this.imgBoby,this.x[i]*this.squWidth,this.y[i]*this.squWidth);
		}
		
	}
	ctx.restore();	

}	
snackObj.prototype.collision=function () {
	//x撞墙
	for(var i=0;i<this.x.length;i++){
		if(this.x[i]<0||this.x[i]>gameXCount-1){
			this.isAlive=false;
		}
	}
	//y撞墙
	for(var i=0;i<this.y.length;i++){
		if(this.y[i]<0||this.y[i]>gameYCount-1){
			this.isAlive=false;
		}
	}
	//撞住自己
	for(var i=0;i<this.x.length;i++){
		for(var j=0;j<this.y.length;j++){
			if(i!=j){
				if(this.x[i]==this.x[j] && this.y[i]==this.y[j]){
					this.isAlive=false;
					return;
				}				
			}
		}
	}
	//是否吃到食物
	for(var i=0;i<this.x.length;i++){
		if(this.x[i]==food.x&&this.y[i]==food.y){
			food.isAlive=false;
			//蛇长大
			this.x.push(undefined);
			this.y.push(undefined);
			score+=100;
			return;
		}
	}
}

var foodObj=function(){
	this.x;
	this.y;
	this.color;
	this.isAlive;
	this.squWidth;
	this.img=new Image();
}
foodObj.prototype.init=function() {
	this.img.src='img/food.png'
	this.color="#f00";
	this.squWidth=gameSquWidth;
	this.isAlive=false;
}
foodObj.prototype.draw=function(){
	if(this.isAlive==false){
		this.x=parseInt(Math.random()*gameXCount); //[0,20]
		this.y=parseInt(Math.random()*gameYCount);//[0,12]
		this.isAlive=true;
	}

	ctx.save();
	//ctx.shadowColor = this.color; 
	//ctx.shadowBlur =20;
	//ctx.fillStyle=this.color;
	ctx.drawImage(this.img,this.x*this.squWidth,this.y*this.squWidth);
	ctx.restore();
}

function scoreDraw(){
	ctx.save();
	//设置字体样式
    ctx.font = "20px Arial";
    ctx.shadowColor = "white";  
    //在X轴上偏移10(右)  
    //ctx.shadowOffsetX = 10;  
    //在Y轴上偏移10(右)  
    //ctx.shadowOffsetY = 10; 
    ctx.shadowBlur =5;
    //设置字体填充颜色
    ctx.fillStyle = "white";
    //从坐标点(50,50)开始绘制文字
    ctx.fillText("Score："+score, 50, 30);
    ctx.restore();
}
