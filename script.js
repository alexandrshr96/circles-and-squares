"use strict";

let canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),
    balls = [],// arr ball
    squares = [],// arr square
    checkFirstClear = true,// флаг для проверки
    sumNumb = 0,// ocherednost' func
    time = 0;// nachalnoye vremya

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Figure{
    constructor(x, y, dx, dy, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }
    /* для круга this.(x,y) + this.radius > canvas.width - this.radius */
    /* movingFigure(){
        if(this.dx == 0) this.dx += 1;
        if(this.dy == 0) this.dy += 1;
        
        if(this.x > canvas.width - this.radius || this.x < 0) this.dx = -(this.dx);
        if(this.y > canvas.height - this.radius || this.y < 0) this.dy = -(this.dy);

        this.x += this.dx;
        this.y += this.dy;
    } */
}

class Ball extends Figure{
    constructor(x, y, dx, dy, radius, color){
        super(x, y, dx, dy, radius, color);
    }

    drawBall(){
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x +this.radius, this.y + this.radius, this.radius, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }

    movingBall(){
        if(this.dx == 0) this.dx += 1;
        if(this.dy == 0) this.dy += 1;
        
        if(this.x + this.radius > canvas.width - this.radius || this.x < 0) this.dx = -(this.dx);
        if(this.y + this.radius > canvas.height - this.radius || this.y < 0) this.dy = -(this.dy);

        this.x += this.dx;
        this.y += this.dy;
    }

}

class Square extends Figure{
    constructor(x, y, dx, dy, radius, color){
        super(x, y, dx, dy, radius, color);
    }
    /* radius = storona kvadrata */
    drawSquare(){
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.radius, this.radius);
        context.closePath();
        context.fill();
    }

    movingSquare(){
        if(this.dx == 0) this.dx += 1;
        if(this.dy == 0) this.dy += 1;
        
        if(this.x > canvas.width - this.radius || this.x < 0) this.dx = -(this.dx);
        if(this.y > canvas.height - this.radius || this.y < 0) this.dy = -(this.dy);

        this.x += this.dx;
        this.y += this.dy;
    }
}
/* zapolnenie massivov figurami */
for(let i = 0; i < 10; i++){
    let ball = new Ball( 0, 0,  getRandom(-4, 4), getRandom(-4, 4), getRandom(30, 60), `rgb(${getRandom(0,255)},${getRandom(0,255)},${getRandom(0,255)})`);
    balls.push(ball);
    let square = new Square( 0, 0,  getRandom(-4, 4), getRandom(-4, 4), getRandom(30, 60), `rgb(${getRandom(0,255)},${getRandom(0,255)},${getRandom(0,255)})`);
    squares.push(square);
}

//console.log(balls);
//console.log(squares);

function clearCanvas(){
    return context.clearRect(0, 0, canvas.width, canvas.height);
}
/* func return funcAnim i ustanavlivaet cleaer dlya 1 func */
function getAnimate(pos){
    let startClear = null;

    if(checkFirstClear){//checkFirstClear = true
        startClear = clearCanvas;// pomeshaem func clear
        checkFirstClear = false;
    }

    return function goAnimate(){
        startClear == null ? startClear = undefined : startClear();//proverka na zapusk
        balls[pos].drawBall();
        balls[pos].movingBall();
        squares[pos].drawSquare();
        squares[pos].movingSquare();
        requestAnimationFrame(goAnimate);
    }
}
/* zapolnenie massiva funciyami zapuska animacii */
var arrayFuncAnimate = [];
for(let i = 0; i < balls.length;i++){
    arrayFuncAnimate[i] = getAnimate(i);
}

//console.log(arrayFuncAnimate);
/* zapusk funciy cherez settimeout */
function loop(){
    setTimeout(() => {
        arrayFuncAnimate[sumNumb]();
        sumNumb++;
        time = 5000;
        if(sumNumb < 10) loop();
    }, time);
}
loop();// start