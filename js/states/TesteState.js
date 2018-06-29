var player;
var bank;
var explosions;
var playerDeath;
var fireButton;
var shields;
var score = 0;
var scoreText;
var gameOver;
var rnd;
var youWin;
var style = { font: "28px Bungee Shade", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
var styleCenter = { font: "48px Bungee Shade", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

var SpaceShooter = SpaceShooter || {};

var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;
var cursors;
var bulletTimer = 0;

SpaceShooter.TesteState = {

    //initiate game settings
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.BULLET_SPEED = -400;

    },

    //load the game assets before the game starts
    preload: function() {
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemybullet', 'assets/death-ray.png');
        this.load.image('enemy','assets/8.png');
        this.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    },
    //executed after everything is loaded
    create: function() {
        starfield = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'starfield');


        explosions = this.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'explosion');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach(function (explosion) {
            explosion.animations.add('explosion');
        });


        this.player = this.add.sprite(this.game.world.centerX,this.game.world.height - 50,'player');
        this.player.health = 100;
        this.player.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        this.player.body.drag.setTo(DRAG, DRAG);
        this.player.weaponLevel = 1;
        this.player.damageAmount = 10;

        playerDeath = this.add.emitter(this.player.x, this.player.y);
        playerDeath.width = 50;
        playerDeath.height = 50;
        playerDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10);
        playerDeath.setAlpha(0.9, 0, 800);
        playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

        this.initBullets();


        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        shields = this.game.add.text(0, 0, 'Shields: ' + Math.max(this.player.health, 0) + '%', style);
        shields.setTextBounds(0, 0, this.game.width*1.7, 100);
        scoreText = this.game.add.text(0, 0, 'Score: ' + score, style);
        scoreText.setTextBounds(0, 0, this.game.width*0.2 , 100);
        gameOver = this.game.add.text(0, 0, 'GAME OVER', styleCenter);
        gameOver.setTextBounds(0, this.game.world.centerY, this.game.world.centerX*2 , 100);
        gameOver.visible = false;
        youWin = this.game.add.text(0, 0, 'YOU WIN', styleCenter);
        youWin.setTextBounds(0, this.game.world.centerY, this.game.world.centerX*2 , 100);
        youWin.visible = false;

        this.initEnemies();

    },
    update: function() {
        starfield.tilePosition.y += 2;

        this.player.body.acceleration.x = 0;

        if (cursors.left.isDown) {
            this.player.body.acceleration.x = -ACCLERATION;
        }
        else if (cursors.right.isDown) {
            this.player.body.acceleration.x = ACCLERATION;
        }

        if (this.player.x > this.game.width - 50) {
            this.player.x = this.game.width - 50;
            this.player.body.acceleration.x = 0;
        }
        if (this.player.x < 50) {
            this.player.x = 50;
            this.player.body.acceleration.x = 0;
        }

        if (this.player.alive && (fireButton.isDown || this.input.activePointer.isDown)) {
            this.fireBullet();
        }

        if (this.input.x < this.game.width - 20 &&
            this.input.x > 20 &&
            this.input.y > 20 &&
            this.input.y < this.game.height - 20) {
            var minDist = 200;
            var dist = this.input.x - this.player.x;
            this.player.body.velocity.x = MAXSPEED * this.game.math.clamp(dist / minDist, -1, 1);
        }

        this.bank = this.player.body.velocity.x / MAXSPEED;
        this.player.scale.x = 1 - Math.abs(this.bank) / 2;
        this.player.angle = bank * 30;
        this.player.damageAmount = 10;

        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this.enemiesBullets, this.player, this.enemyHitsPlayer, null, this);

    },

    initBullets: function () {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    },

    createPlayerBullets: function () {
        var bullet = this.playerBullets.getFirstExists(false);
        if (!bullet){
            bullet = new SpaceShooter.PlayerBullet(this.game,this.player.x,this.player.top);
            this.playerBullets.add(bullet);
        }else{
            bullet.reset(this.player.x,this.player.top);
        }

        bullet.body.velocity.y = this.BULLET_SPEED;
        bullet.damageAmount = 10;
    },

    fireBullet:function () {
        var BULLET_SPACING = 250;

            if (this.time.now > bulletTimer) {
                this.createPlayerBullets();
                bulletTimer = this.time.now + BULLET_SPACING;
            }

    },

    initEnemies: function () {

        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.enemiesBullets = this.add.group();
        this.enemiesBullets.enableBody = true;

        var points = {
            "x":[0,128,256,384,512,640,384,0,384,640,512,384,256,128,0],
            "y":[348,60,250,358,32,129,348,60,25,358,32,129,348,60,250]
        };

        var enemy = new SpaceShooter.Enemy(this.game,0,0,'enemy',300,this.enemiesBullets,points);
        enemy.damageAmount = 50;
        this.enemies.health = 1000;
        this.enemies.add(enemy);
    },

    hitEnemy:function() {
        var enemy = this.enemies.getFirstExists();
        var bullet = this.playerBullets.getFirstExists();
        bullet.kill();
        enemy.damage(bullet.damageAmount);
        console.log(enemy.health);

        if(enemy.alive){
            var explosion = explosions.getFirstExists(false);
            explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
        }else{

            score += enemy.damageAmount * 1000;
            scoreText.setText('Score: ' + score);

            youWin.visible = true;
            youWin.alpha = 0;
            var fadeInYouWin = this.add.tween(youWin);
            fadeInYouWin.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInYouWin.onComplete.add(setResetHandlers);
            fadeInYouWin.start();
            function setResetHandlers() {
                tapRestart = this.SpaceShooter.TesteState.input.onTap.addOnce(_restart, this);
                spaceRestart = fireButton.onDown.addOnce(_restart, this);
                function _restart() {
                    tapRestart.detach();
                    spaceRestart.detach();
                    this.SpaceShooter.TesteState.restart(this.SpaceShooter.TesteState.game);
                }
            }
        }
    },

    enemyHitsPlayer:function(player, bullet) {
        bullet.kill();

        player.damage(bullet.damageAmount);
        shields.setText('Shields: ' + Math.max(player.health, 0) + '%');
        if (player.alive) {
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
        } else {
            playerDeath.x = player.x;
            playerDeath.y = player.y;
            playerDeath.start(false, 1000, 10, 10);

            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = this.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();

            function setResetHandlers() {
                tapRestart = this.SpaceShooter.TesteState.input.onTap.addOnce(_restart, this);
                spaceRestart = fireButton.onDown.addOnce(_restart, this);
                function _restart() {
                    tapRestart.detach();
                    spaceRestart.detach();
                    this.SpaceShooter.TesteState.restart(this.SpaceShooter.TesteState.game);
                }
            }
        }
    },


    restart:function(game) {
        this.player.weaponLevel = 1;
        this.player.revive();
        this.player.health = 100;
        shields.setText('Shields: ' + Math.max(this.player.health, 0) + '%');
        score = 0;
        scoreText.setText('Score: ' + score);
        gameOver.visible = false;

        game.state.start('MenuState');
    }
};