//Determinando as variáveis usadas no jogo
var player;
var blueEnemies;
var starfield;
var cursors;
var shipTrail;
var explosions;
var playerDeath;
var bullets;
var fireButton;
var bulletTimer = 0;
var blueEnemyLaunchTimer;
var blueEnemySpacing = 2500;
var life;
var score = 0;
var gameOver;
var scoreText;

//Determinando espécie de constantes
var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;


var GameState = {

    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        this.game.world.setBounds(0, 0, 800, 600);
    },

    preload : function() {
    //Pré carregando as imagens do que será utilizado
        game.load.image('starfield', 'assets/starfield.png');
        game.load.image('ship', 'assets/player.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('enemy-blue', 'assets/enemy-blue.png');
        game.load.image('blueEnemyBullet', 'assets/enemy-blue-bullet.png');
        game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
        game.load.bitmapFont('spacefont', 'assets/spacefont/spacefont.png', 'assets/spacefont/spacefont.xml');
    },
    create : function() {
        //Criando o fundo da tela que será rolável
        starfield = game.add.tileSprite(0,0,800,600,'starfield');

        //Criando grupo de tiros
        bullets = game.add.group();
        //Ativando todos corpos no grupo
        bullets.enableBody = true;
        //Colocando física de arcade
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        //Colocando número de tiros
        bullets.createMultiple(30, 'bullet');
        //Setando o ínicio do tiro
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        //Matando o tiro ao sair da tela
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //Criando o herói do jogo
        //Colocando o sprite aqui
        player = game.add.sprite(400,500,`ship`);
        //Ancorando a nave player
        player.anchor.setTo(0.5, 0.5);
        //Criando a vida do herói
        player.health = 100;
        //Adicionando física ao herói
        game.physics.enable(player, Phaser.Physics.ARCADE);
        //Não sei o que faz *********** Descobrir
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        //Recriando o player quando morrer
        player.events.onKilled.add(function(){
            shipTrail.kill();
        });
        player.events.onRevived.add(function(){
            shipTrail.start(false, 5000, 10);
        });

        //Criando inimigos azuis
        //Agrupando todos inimigos azuis criados
        blueEnemies = game.add.group();
        //Habilitando todos dentro do grupo
        blueEnemies.enableBody = true;
        //Adicionando física
        blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        //Criando multiplos dentro do grupo
        blueEnemies.createMultiple(30, 'enemy-blue');
        //Ancorando posição inicial e angulo
        blueEnemies.setAll('anchor.x', 0.5);
        blueEnemies.setAll('anchor.y', 0.5);
        blueEnemies.setAll('scale.x', 0.5);
        blueEnemies.setAll('scale.y', 0.5);
        blueEnemies.setAll('angle', 180);
        //Determinando o dano de cada inimigo azul
        blueEnemies.forEach(function(enemy){
            enemy.damageAmount = 20;
        });


        //Lançando os inimigos
        game.time.events.add(1000, launchBlueEnemy);

        //Criando tiros dos inimigos azuis
        //Mesma idéia do tiro dos jogadores
        blueEnemyBullets = game.add.group();
        blueEnemyBullets.enableBody = true;
        blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemyBullets.createMultiple(30, 'blueEnemyBullet');
        blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        blueEnemyBullets.setAll('alpha', 0.9);
        blueEnemyBullets.setAll('anchor.x', 0.5);
        blueEnemyBullets.setAll('anchor.y', 0.5);
        blueEnemyBullets.setAll('outOfBoundsKill', true);
        blueEnemyBullets.setAll('checkWorldBounds', true);
        blueEnemyBullets.forEach(function(enemy){
            enemy.body.setSize(20, 20);
        });

        //Criando grupo de explosões
        explosions = game.add.group();
        //Ativando as peças do grupo
        explosions.enableBody = true;
        //Fisica arcade
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        //Criando quantidade
        explosions.createMultiple(30, 'explosion');
        //Setando lugar
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        //Adiciona animação
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });

        //Criando explosão da morte do player
        playerDeath = game.add.emitter(player.x, player.y);
        //Criando tamanho da explosão
        playerDeath.width = 50;
        playerDeath.height = 50;
        //Criando a ordem das particulas com as transparencias e atenuamento de animação
        playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
        playerDeath.setAlpha(0.9, 0, 800);
        playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

        //Criando "foguinho" da nave
        //Criando um emissor de em uma posição
        shipTrail = game.add.emitter(player.x, player.y + 10, 400);
        //Tamanho
        shipTrail.width = 10;
        //Usando o tiro como particula
        shipTrail.makeParticles('bullet');
        //Setando velocidades
        shipTrail.setXSpeed(30, -30);
        shipTrail.setYSpeed(200, 180);
        //Rotação
        shipTrail.setRotation(50,-50);
        //Transparência
        shipTrail.setAlpha(1, 0.01, 800);
        //Escala, com um "easing" que suaviza a animação
        shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
        //Startando essa animação
        shipTrail.start(false, 5000, 10);

        //Controles para jogar
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //Adicionando HUD de Vida
        life = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 50);
        life.render = function () {
            life.text = 'Shield: ' + Math.max(player.health, 0) +'%';
        };
        life.render();

        //Adicionando HUD de score
        scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
        scoreText.render = function () {
            scoreText.text = 'Score: ' + score;
        };
        scoreText.render();

        //Texto de gmae over
        gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
        gameOver.x = gameOver.x - gameOver.textWidth / 2;
        gameOver.y = gameOver.y - gameOver.textHeight / 3;
        gameOver.visible = false;


    },
    update : function() {
        //Criando ilusão de movimento com o fundo movimentandio
        starfield.tilePosition.y +=2;

        //Configurando controles para jogo, vendo os toques das teclas
        player.body.acceleration.x = 0;
        if (cursors.left.isDown){player.body.acceleration.x = -ACCLERATION;}
        else if (cursors.right.isDown){player.body.acceleration.x = ACCLERATION;}
        //Impedir sair das laterais do jogo
        if (player.x > game.width - 50) { player.x = game.width - 50; player.body.acceleration.x = 0; }
        if (player.x < 50) { player.x = 50; player.body.acceleration.x = 0;}

        //Colocando "foguinho" na nave
        shipTrail.x = player.x;

        //Ativando o tiro com o toque de botão
        if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
            //função de tiro de bala
            fireBullet();
        }

        //Checando colisão dos inimigos e dos tiros
        game.physics.arcade.overlap(player, blueEnemies, shipCollide, null, this);
        game.physics.arcade.overlap(blueEnemies, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);

        //Teste de game over
        if (! player.alive && gameOver.visible === false) {
            gameOver.visible = true;
            gameOver.alpha = 0;
            //Animação de game over aparecendo aos poucos
            var fadeInGameOver = game.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();
            function setResetHandlers() {
                //  The "click to restart" handler
                tapRestart = game.input.onTap.addOnce(_restart,this);
                spaceRestart = fireButton.onDown.addOnce(_restart,this);
                function _restart() {
                    tapRestart.detach();
                    spaceRestart.detach();

                    //Chamando função restart
                    restart();
                }
            }
        }
    },

    render : function() {
    }

};

function fireBullet() {
    //Evitar atirar mutio rápido, só pode atirar depois de animar por completo outro tiro
    if (game.time.now > bulletTimer)
    {
        //Velocidade do tiro, espçamento dos tiros
        var BULLET_SPEED = 400;
        var BULLET_SPACING = 250;
        //  Pegando o peimeiro tiro do grupo do tiro
        var bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //Se o tiro existe
            //Faça o tiro saindo da ponta de uma nave com angulo certo, angulo do jogador
            var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
            bullet.reset(player.x + bulletOffset, player.y);
            bullet.angle = player.angle;
            //Colocando fisica arcade com velocidade movendo no eixo Y
            game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
            bullet.body.velocity.x += player.body.velocity.x;
            //Timer e espaçamento de balas juntos como tempo para rodar o if
            bulletTimer = game.time.now + BULLET_SPACING;
        }
    }

}

function launchBlueEnemy() {
    //Iniciando em X random
    var startingX = game.rnd.integerInRange(100, game.width - 100);
    //Determinando velocidade vertical
    var verticalSpeed = 180;
    //Determinando onda seinodal
    var spread = 60;
    var frequency = 70;
    var verticalSpacing = 70;
    //Determinando o número de inimigos por onda
    var numEnemiesInWave = 2;

    //  Lançando a onda
    for (var i =0; i < numEnemiesInWave; i++) {
        //Verificando de inimigo no grupo
        var enemy = blueEnemies.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = verticalSpeed;

            //  Dterminando o tiro
            var bulletSpeed = 400;
            var firingDelay = 2000;
            enemy.bullets = 1;
            enemy.lastShot = 0;

            //Colocando movimento em todos inimgos azuis que existirem
            enemy.update = function(){
                //Determinando seinodal
                this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;


                // Setando e criando o tiro
                enemyBullet = blueEnemyBullets.getFirstExists(false);
                if (enemyBullet &&
                    this.alive &&
                    this.bullets &&
                    this.y > game.width / 8 &&
                    game.time.now > firingDelay + this.lastShot) {
                    this.lastShot = game.time.now;
                    this.bullets--;
                    enemyBullet.reset(this.x, this.y + this.height / 2);
                    enemyBullet.damageAmount = this.damageAmount;
                    var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                    enemyBullet.angle = game.math.radToDeg(angle);
                }

                //Destruindo os inimigos quando sai da tela
                if (this.y > game.height + 200) {
                    this.kill();
                    this.y = -20;
                }
            };
        }
    }

    //Enviando outra onda depois do tempo determinado
    blueEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(blueEnemySpacing, blueEnemySpacing + 4000), launchBlueEnemy);
}

//Quando o tiro do inimigo acerta o player
function enemyHitsPlayer (player, bullet) {
    //Tiro destruído
    bullet.kill();

    //player toma o dano
    player.damage(bullet.damageAmount);
    life.render()

    //Se o player sobrevive, roda uma animção de explosão comum, se ele morre, roda a animaç~~ao de grande explosão
    if (player.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
    }
}

//Colisão com inimigo
function shipCollide(player, enemy) {
    //Mata o inimigo na colisão
    enemy.kill();
    //Dar dano no player
    player.damage(enemy.damageAmount);
    life.render();
    //Testa se o player tá vivo, se sim so anima a explosao, se não anima a explosao de morte
    if (player.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
    }
}

//Recebe inimigo e tiro para uma funcao que destroi
function hitEnemy(enemy, bullet) {
    //Pega o primeiro do grupo
    var explosion = explosions.getFirstExists(false);
    //Inicando animacao da explosao
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    //explosao acompnhando o inimigo
    explosion.body.velocity.y = enemy.body.velocity.y;
    //diminuindo alpha
    explosion.alpha = 0.7;
    //iniciando animação da explosão
    explosion.play('explosion', 30, false, true);
    //Se for morte trigga explosão se não toma apenas dano
    if (enemy.finishOff && enemy.health < 5) {
        enemy.finishOff();
    } else {
        enemy.damage(enemy.damageAmount);
    }
    //Mata o tiro
    bullet.kill();

    //Adiciona no placar
    score += enemy.damageAmount * 10;
    scoreText.render();
}

function restart () {
    //  Revivendo o player
    player.weaponLevel = 1;
    player.revive();
    player.health = 100;
    life.render();
    score = 0;
    scoreText.render();

    //  Escondendo o game over
    gameOver.visible = false;

}

var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');