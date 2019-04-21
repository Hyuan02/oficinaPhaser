
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'renderPhaser', { preload: preload, create: create, update:update});
var player,bala,enemy, balaEnemy;
var somBala, somBalaEnemy, musica;
var hudScore;
var playerScore;
// var contador;
function preload() {

    //  Specify a unique key and a URL path
    //  The key must be unique between all images.
    game.load.image('bg','sprites/Backgrounds/purple.png');
    game.load.image('player','sprites/PNG/playerShip1_green.png');
    game.load.image('bullet','sprites/PNG/Lasers/laserBlue04.png');
    game.load.image('enemy', 'sprites/PNG/Enemies/enemyBlack5.png');
    game.load.image('bulletEnemy', 'sprites/PNG/Lasers/laserRed08.png');
    game.load.audio('bulletSound','sprites/Bonus/sfx_laser2.ogg');
    game.load.audio('bulletSoundEnemy','sprites/Bonus/sfx_laser1.ogg');
    game.load.audio('music','sprites/Bonus/BabyOneMoreTime8Bit.mp3');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    for(let posY=0; posY<3; posY++){
        for(let posX=0; posX<4; posX++){
        game.add.image(256*posX,256*posY, "bg");
        
        }
    }

    player = game.add.sprite(400,500,'player');
    hudScore = game.add.text(50,50);
    playerScore = 0;
    
    enemy = game.add.group();
    

    player.x -= player.width/2;

    game.physics.enable(player);

    player.body.allowGravity = false;
    player.body.collideWorldBounds = true;

    somBala = game.add.audio('bulletSound');
    somBalaEnemy = game.add.audio('bulletSoundEnemy');
    musica = game.add.audio('music');
    musica.play();
    musica.loop = true;
    gerarBala();
    gerarBalaInimigo();
    
    spawnManager();
}

function update(){
    controles();
    checaCollisao();
    atualizaScore();
}

function controles(){
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        player.body.x -= 5;

    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        player.body.x += 5;
        
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        player.body.y -= 5;

    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        player.body.y += 5;
        
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){

        if(player.alive){
            bala.fire();
            somBala.play();
        }

        else{
            restart();
        }
            
    }
}

function gerarBala(){
    
    bala = game.add.weapon(20,'bullet');
    // bala.fireFrom.set(player.centerX,player.top);
    bala.trackSprite(player,player.width/2,0,false);
    bala.fireAngle = 270;
    bala.bulletAngleOffset = 90;
    bala.fireRate = 200;
    bala.bulletSpeed = 400;
    bala.bulletAngleVariance = 10;
    bala.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    
}

function gerarBalaInimigo(){
    balaEnemy = game.add.weapon(20,'bulletEnemy');
    // bala.fireFrom.set(player.centerX,player.top);
    balaEnemy.fireAngle = 90;
    balaEnemy.bulletAngleOffset = 90;
    balaEnemy.fireRate = 200;
    balaEnemy.bulletSpeed = 400;
    balaEnemy.bulletAngleVariance = 10;
    balaEnemy.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
}


function geradorEnemy(){
    let e = enemy.create(game.rnd.integerInRange(100,600),game.rnd.integerInRange(50,300),'enemy');
    game.physics.enable(enemy);
    e.body.velocity.x = game.rnd.integerInRange(200,400);
    e.body.collideWorldBounds = true;
    e.body.bounce.set(1);
    
}


function spawnManager(){
    setInterval(geradorEnemy,5000);
    setInterval(atirarInimigo,2500);
}

function checaCollisao(){
    game.physics.arcade.overlap(bala.bullets,enemy,mataInimigo,null,this);
    game.physics.arcade.overlap(balaEnemy.bullets,player,mataPlayer,null,this);
}

function mataInimigo(projetil, enemy){
    projetil.kill();
    enemy.destroy();
    playerScore += 5;
}

function mataPlayer(weapon, player){
    weapon.kill();
    player.kill();
}

function atirarInimigo(){
    if(enemy.length>0){
        let e = game.rnd.integerInRange(0,enemy.length-1);
        balaEnemy.trackSprite(enemy.getAt(e),enemy.getAt(e).width/2,enemy.getAt(e).height,false);
        balaEnemy.fireAtSprite(player);
        somBalaEnemy.play();
    }
}

function atualizaScore() {
    hudScore.setText("Score: "+playerScore);
}

function restart(){
    enemy.removeAll(true);
    playerScore = 0;
    player.body.x = 400;
    player.body.y = 500;
    player.revive();
}