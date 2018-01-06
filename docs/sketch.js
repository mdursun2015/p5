var x;
var y;
var bulletNr=0;
var game;
var stars =[];
var bulletCount;
var img;

function preload(){
    img=loadImage('earth.png');
}

function setup() {
    createCanvas(400,300);
  
    x= width/2;
    y =height;
    game = new Game();
    game.loadBullets(5);
    stars = loadBackground();
    bulletCount=5;
   
}

function draw(){
     
    background(51);
 
    renderStars();
    
<<<<<<< HEAD
    image(img,width/2-30,height-30);
    game.shoot(x,y,bulletNr);
    
    game.cleanBullets();
     game.ufo.show();
    if(game.ufo.win){
        game.showResult(true);
        bulletNr=0;
        noLoop();
    }
    if(!(bulletCount+1)){
         
         game.showResult(false);
         bulletNr=0;
         noLoop();
    }
    renderBulletsLeft();
   
    
        
   
    
}

function renderBulletsLeft(){
     noFill();
    stroke(255);
    rect(width-80,10,70,20);
    noStroke();
    ellipseMode(CENTER);
    fill(255);
    for(var i = 0;i<bulletCount;i++){
        ellipse(width-19-(i*13),20,10,10);
    }
}

function renderStars(){
    stroke(255,100);
    stars.map(a=> point(a.x,a.y));
}

function loadBackground(){
   
    var stars=[];
  
    for(var i=0; i<100;i++){
    var rSW=random(1,2);
    var posx = random(0,width);
    var posy= random (0,height);  
    strokeWeight(rSW);
    stars.push({x:posx,y:posy});
        
    }
    
   return stars;
}

function mouseClicked(){

    bulletNr+=1;
    x=mouseX;
    y=mouseY;
    
    bulletCount-=1;
}

function keyPressed(){
    if(keyCode===13){
       setup();
       loop();
    }
}


function Game(){

    this.bullets = [];
    this.shots=[];
    this.ufo=new Ufo(0.01,10000);
    this.earth = new Earth(width/2,height);
    
    this.cleanBullets = function(){
         for(var i=0; i<this.bullets.length; i++){
            if (this.bullets[i].isOff()){
               if(this.bullets[i].id==4){
                    this.showResult(false);
                    bulletNr=0;
                    noLoop();
               }
                  
              
                this.bullets.splice(i,1);
               
            }
        }
    }
    
    this.showResult=function(r){
        if(r){
            fill(255);
            textSize(80);
            text('You Won!', width/18, height-140);
            textSize(20);
            text("press enter to replay", width/2-90, height-100);
        }else{
            fill(255);
            textSize(80);
            text('You Lose!', width/18, height-140);
            textSize(20);
            
            text("press enter to replay", width/2-90, height-100);
        }
        
           
    }
    
    this.loadBullets=function(bc){
       
        for(var i=0; i<bc;i++){
            
        var bullet = new Bullet(width/2,height);
        bullet.id=i;
        this.bullets.push(bullet);
        }
        
      
    }
    
    this.shoot = function(x,y,bulletNr){
       
        if(this.shots.indexOf(bulletNr)<0){
              this.shots.push(bulletNr);
        }
       
        var shots = this.shots;
        var hit=false;
        var ufo=this.ufo;
        var posx=this.earth.pos.x;
         var posy=this.earth.pos.y;
        this.bullets.forEach(function(b){
           
            if(shots.indexOf(b.id+1)>-1){
               
                if(b.pos.x===width/2){
                     b.pos.x=posx;
                    b.pos.y=posy;
                }
               
                b.show();
                b.moveTo(x,y);
                hit=b.intersect(ufo.pos.x,ufo.pos.y);
                
                if(hit){
                    ufo.hit=true;
                    b.id=-2;
                }
                
            }
         
        });
        
        
    }
}

function Earth(ex,ey){
    this.pos={x:ex,y:ey}
    this.hit = false;
    this.r = 0;
    this.l=0;
    this.offset = random(-20,20);
    
    
    this.show = function(){
   pop();
    this.pos.x+= this.r;  
    this.pos.x+= this.l;  
    fill(255);
    noStroke();
    ellipseMode(CENTER);
    ellipse(this.pos.x,this.pos.y,40,40);
    
     push();
    }
}

function Ufo(uxoff,uyoff){
    this.id=0;
    this.pos={x:width/2,y:30};
    this.xoff =uxoff;
    this.yoff = uyoff;
    this.acc=0.2;
    this.vel=0;
    this.hit=false;
    this.hitCount=0;
    this.cons = 1;
    this.win=false;
    
    this.show = function(){
     
        if(this.hit){
     
              this.cons *= 0.5;
           if(this.cons===0.25){
              this.win=true;
       }
             
            
        }else{
          
            this.xoff += 0.01;
            this.yoff += 0.01;
            this.pos.x=noise(this.xoff)*width;
            this.pos.y=noise(this.yoff)*height/2; 
            }
        this.renderUfo();
        this.hit=false;
    }
    
    
    
    
    this.renderUfo =  function(){
        noStroke();
        ellipseMode(CENTER);
        fill(255);
        ellipse(this.pos.x,this.pos.y,40*this.cons,30*this.cons);
        fill(51);
        ellipse(this.pos.x,this.pos.y+(6*this.cons),40*this.cons,13*this.cons);
        fill(255);
        ellipse(this.pos.x,this.pos.y+(3*this.cons),70*this.cons,12*this.cons);
        fill(51);
        ellipse(this.pos.x+(7*this.cons),this.pos.y-(5*this.cons),12*this.cons,12*this.cons);
        fill(51);
        ellipse(this.pos.x-(7*this.cons),this.pos.y-(5*this.cons),12*this.cons,12*this.cons);
}
        

}
function Bullet(ix,iy){
    this.id=0;
    this.pos={x:ix,y:iy};
    this.speed = 6;
    this.xToGo=0;
    this.yToGo=0;
    this.hit=false;
    this.distance = function(){
         return Math.sqrt((this.xToGo*this.xToGo)+(this.yToGo*this.yToGo));
    }
   
    
    this.isOff = function(){
        return this.pos.y<0 || this.pos.y>height;
    }
    
    this.moveTo = function(x,y){
       
      
        if(this.xToGo===0 && this.yToGo===0){
         this.xToGo = x-this.pos.x;
         this.yToGo = y-this.pos.y;
        }
      
        this.pos.x += this.xToGo/this.distance()*this.speed;
           
        this.pos.y +=this.yToGo/this.distance()*this.speed;
             
    }
    
    this.intersect = function(ux,uy){
       var distance=Math.sqrt((this.pos.x-ux)* (this.pos.x-ux) +(this.pos.y-uy)*(this.pos.y-uy));
        if(distance<20){
           
            return true;
        }
       
        return false;
    }
     
    this.show = function(){
       push();
        if(this.hit){
      
           return;
        }
      
        noStroke();
        ellipseMode(CENTER);
         fill(255);
        
        ellipse(this.pos.x,this.pos.y,5,5);
       
        pop();
    }
    
    
}