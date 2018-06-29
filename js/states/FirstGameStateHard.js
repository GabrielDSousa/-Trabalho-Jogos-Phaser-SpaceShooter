var player;
var greenEnemies;
var blueEnemies;
var starfield;
var cursors;
var bank;
var shipTrail;
var explosions;
var playerDeath;
var bullets;
var fireButton;
var bulletTimer = 0;
var shields;
var score = 0;
var scoreText;
var greenEnemyLaunchTimer;
var greenEnemySpacing = 1000;
var blueEnemyLaunchTimer;
var blueEnemyLaunched = false;
var blueEnemySpacing = 2500;
var bossLaunchTimer;
var bossLaunched = false;
var bossBulletTimer = 0;
var gameOver;
var ray;
var rnd;
var youWin;
var style = { font: "28px Bungee Shade", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
var styleCenter = { font: "48px Bungee Shade", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

var SpaceShooter = SpaceShooter || {};

SpaceShooter.FirstGameStateHard = {

    preload:function ()
    {
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('ship', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemy-green', 'assets/enemy-green.png');
        this.load.image('enemy-blue', 'assets/enemy-blue.png');
        this.load.image('blueEnemyBullet', 'assets/enemy-blue-bullet.png');
        this.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
        this.load.image('boss', 'assets/boss.png');
        this.load.image('deathRay', 'assets/death-ray.png');
    },

    create:function ()
    {
        starfield = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'starfield');

        bullets = this.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        player = this.add.sprite(this.game.world.centerX,this.game.world.height - 50, 'ship');
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        player.weaponLevel = 1;
        player.events.onKilled.add(function () {
            shipTrail.kill();
        });
        player.events.onRevived.add(function () {
            shipTrail.start(false, 5000, 10);
        });


        this.createGreenEnemies();

        blueEnemyBullets = this.add.group();
        blueEnemyBullets.enableBody = true;
        blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemyBullets.createMultiple(30, 'blueEnemyBullet');
        blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        blueEnemyBullets.setAll('alpha', 0.9);
        blueEnemyBullets.setAll('anchor.x', 0.5);
        blueEnemyBullets.setAll('anchor.y', 0.5);
        blueEnemyBullets.setAll('outOfBoundsKill', true);
        blueEnemyBullets.setAll('checkWorldBounds', true);
        blueEnemyBullets.forEach(function (enemy) {
            enemy.body.setSize(20, 20);
        });

        blueEnemies = this.add.group();
        blueEnemies.enableBody = true;
        blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemies.createMultiple(30, 'enemy-blue');
        blueEnemies.setAll('anchor.x', 0.5);
        blueEnemies.setAll('anchor.y', 0.5);
        blueEnemies.setAll('scale.x', 0.5);
        blueEnemies.setAll('scale.y', 0.5);
        blueEnemies.setAll('angle', 180);
        blueEnemies.forEach(function (enemy) {
            enemy.damageAmount = 40;
        });

        boss = this.add.sprite(0, 0, 'boss');
        boss.exists = false;
        boss.alive = false;
        boss.anchor.setTo(0.5, 0.5);
        boss.damageAmount = 100;
        boss.angle = 180;
        boss.scale.x = 0.6;
        boss.scale.y = 0.6;
        this.physics.enable(boss, Phaser.Physics.ARCADE);
        boss.body.maxVelocity.setTo(100, 80);
        boss.dying = false;
        boss.finishOff = function () {
            if (!boss.dying) {
                boss.dying = true;
                bossDeath.x = boss.x;
                bossDeath.y = boss.y;
                bossDeath.start(false, 1000, 50, 20);
                this.game.time.events.add(1000, function () {
                    var explosion = explosions.getFirstExists(false);
                    var beforeScaleX = explosions.scale.x;
                    var beforeScaleY = explosions.scale.y;
                    var beforeAlpha = explosions.alpha;
                    explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
                    explosion.alpha = 0.4;
                    explosion.scale.x = 3;
                    explosion.scale.y = 3;
                    var animation = explosion.play('explosion', 30, false, true);
                    animation.onComplete.addOnce(function () {
                        explosion.scale.x = beforeScaleX;
                        explosion.scale.y = beforeScaleY;
                        explosion.alpha = beforeAlpha;
                    });
                    boss.kill();
                    booster.kill();
                    boss.dying = false;
                    bossDeath.on = false;
                    youWin.visible = true;
                    youWin.alpha = 0;
                    var fadeInYouWin = this.SpaceShooter.FirstGameStateHard.add.tween(youWin);
                    fadeInYouWin.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
                    fadeInYouWin.onComplete.add(setResetHandlers);
                    fadeInYouWin.start();
                    greenEnemies.callAll('kill');
                    this.SpaceShooter.FirstGameStateHard.game.time.events.remove(greenEnemyLaunchTimer);
                    blueEnemies.callAll('kill');
                    blueEnemyBullets.callAll('kill');
                    this.SpaceShooter.FirstGameStateHard.game.time.events.remove(blueEnemyLaunchTimer);
                    boss.kill();
                    booster.kill();
                    this.SpaceShooter.FirstGameStateHard.game.time.events.remove(bossLaunchTimer);

                    blueEnemies.callAll('kill');
                    this.SpaceShooter.FirstGameStateHard.game.time.events.remove(blueEnemyLaunchTimer);

                    function setResetHandlers() {
                        tapRestart = this.SpaceShooter.FirstGameStateHard.input.onTap.addOnce(_restart, this);
                        spaceRestart = fireButton.onDown.addOnce(_restart, this);
                        function _restart() {
                            tapRestart.detach();
                            spaceRestart.detach();
                            this.SpaceShooter.FirstGameStateHard.restart(this.SpaceShooter.FirstGameStateHard.game);
                        }
                    }
                });

                blueEnemySpacing = 2500;
                greenEnemySpacing = 1000;

                player.health = Math.min(100, player.health + 40);
                shields.setText('Shields: ' + Math.max(player.health, 0) + '%');
            }
        };

        this.addRay(1);
        this.addRay(-1);

        var ship = this.add.sprite(0, 0, 'boss');
        ship.anchor = {x: 0.5, y: 0.5};
        boss.addChild(ship);

        boss.fire = function () {
            if (this.game.time.now > bossBulletTimer) {
                var raySpacing = 1500;
                var chargeTime = 500;
                var rayTime = 500;

                function chargeAndShoot(side) {
                    ray = boss['ray' + side];
                    ray.name = side
                    ray.revive();
                    ray.y = 80;
                    ray.alpha = 0;
                    ray.scale.y = 13;
                    this.SpaceShooter.FirstGameStateHard.game.add.tween(ray).to({alpha: 1}, chargeTime, Phaser.Easing.Linear.In, true).onComplete.add(function (ray) {
                        ray.scale.y = 150;
                        this.SpaceShooter.FirstGameStateHard.game.add.tween(ray).to({y: -1500}, rayTime, Phaser.Easing.Linear.In, true).onComplete.add(function (ray) {
                            ray.kill();
                        });
                    });
                }

                chargeAndShoot('Right');
                chargeAndShoot('Left');

                bossBulletTimer = this.game.time.now + raySpacing;
            }
        };

        boss.update = function () {
            if (!boss.alive) return;

            boss.rayLeft.update();
            boss.rayRight.update();

            if (boss.y > 140) {
                boss.body.acceleration.y = -50;
            }
            if (boss.y < 140) {
                boss.body.acceleration.y = 50;
            }
            if (boss.x > player.x + 50) {
                boss.body.acceleration.x = -50;
            } else if (boss.x < player.x - 50) {
                boss.body.acceleration.x = 50;
            } else {
                boss.body.acceleration.x = 0;
            }

            var bank = boss.body.velocity.x / MAXSPEED;
            boss.scale.x = 0.6 - Math.abs(bank) / 3;
            boss.angle = 180 - bank * 20;

            booster.x = boss.x + -5 * bank;
            booster.y = boss.y + 10 * Math.abs(bank) - boss.height / 2;

            var angleToPlayer = this.game.math.radToDeg(this.game.physics.arcade.angleBetween(boss, player)) - 90;
            var anglePointing = 180 - Math.abs(boss.angle);
            if (anglePointing - angleToPlayer < 18) {
                boss.fire();
            }
        };

        booster = this.add.emitter(boss.body.x, boss.body.y - boss.height / 2);
        booster.width = 0;
        booster.makeParticles('blueEnemyBullet');
        booster.forEach(function (p) {
            p.crop({x: 120, y: 0, width: 45, height: 50});
            p.anchor.x = this.SpaceShooter.FirstGameStateHard.rnd.pick([1, -1]) * 0.95 + 0.5;
            p.anchor.y = 0.75;
        });
        booster.setXSpeed(0, 0);
        booster.setRotation(0, 0);
        booster.setYSpeed(-30, -50);
        booster.gravity = 0;
        booster.setAlpha(1, 0.1, 400);
        booster.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
        boss.bringToTop();

        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        shipTrail = this.add.emitter(player.x, player.y + 10, 400);
        shipTrail.width = 10;
        shipTrail.makeParticles('bullet');
        shipTrail.setXSpeed(30, -30);
        shipTrail.setYSpeed(200, 180);
        shipTrail.setRotation(50, -50);
        shipTrail.setAlpha(1, 0.01, 800);
        shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
        shipTrail.start(false, 5000, 10);

        explosions = this.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'explosion');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach(function (explosion) {
            explosion.animations.add('explosion');
        });

        playerDeath = this.add.emitter(player.x, player.y);
        playerDeath.width = 50;
        playerDeath.height = 50;
        playerDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10);
        playerDeath.setAlpha(0.9, 0, 800);
        playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

        bossDeath = this.add.emitter(boss.x, boss.y);
        bossDeath.width = boss.width / 2;
        bossDeath.height = boss.height / 2;
        bossDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 20);
        bossDeath.setAlpha(0.9, 0, 900);
        bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);


        shields = this.game.add.text(0, 0, 'Shields: ' + Math.max(player.health, 0) + '%', style);
        shields.setTextBounds(0, 0, this.game.width*1.7, 100);

        scoreText = this.game.add.text(0, 0, 'Score: ' + score, style);
        scoreText.setTextBounds(0, 0, this.game.width*0.2 , 100);

        gameOver = this.game.add.text(0, 0, 'GAME OVER', styleCenter);
        gameOver.setTextBounds(0, this.game.world.centerY, this.game.world.centerX*2 , 100);
        gameOver.visible = false;

        youWin = this.game.add.text(0, 0, 'Novo desafiante aparece !', styleCenter);
        youWin.setTextBounds(0, this.game.world.centerY, this.game.world.centerX*2 , 100);
        youWin.visible = false;
    },

    update:function () {
        starfield.tilePosition.y += 2;

        player.body.acceleration.x = 0;

        if (cursors.left.isDown) {
            player.body.acceleration.x = -ACCLERATION;
        }
        else if (cursors.right.isDown) {
            player.body.acceleration.x = ACCLERATION;
        }

        if (player.x > this.game.width - 50) {
            player.x = this.game.width - 50;
            player.body.acceleration.x = 0;
        }
        if (player.x < 50) {
            player.x = 50;
            player.body.acceleration.x = 0;
        }

        if (player.alive && (fireButton.isDown || this.input.activePointer.isDown)) {
            this.fireBullet();
        }

        if (this.input.x < this.game.width - 20 &&
            this.input.x > 20 &&
            this.input.y > 20 &&
            this.input.y < this.game.height - 20) {
            var minDist = 200;
            var dist = this.input.x - player.x;
            player.body.velocity.x = MAXSPEED * this.game.math.clamp(dist / minDist, -1, 1);
        }

        bank = player.body.velocity.x / MAXSPEED;
        player.scale.x = 1 - Math.abs(bank) / 2;
        player.angle = bank * 30;

        shipTrail.x = player.x;

        this.physics.arcade.overlap(player, greenEnemies, this.shipCollide, null, this);
        this.physics.arcade.overlap(greenEnemies, bullets, this.hitEnemy, null, this);

        this.physics.arcade.overlap(player, blueEnemies, this.shipCollide, null, this);
        this.physics.arcade.overlap(blueEnemies, bullets, this.hitEnemy, null, this);

        this.physics.arcade.overlap(boss, bullets, this.hitEnemy, this.bossHitTest, this);
        this.physics.arcade.overlap(player, boss.rayLeft, this.enemyHitsPlayer, null, this);
        this.physics.arcade.overlap(player, boss.rayRight, this.enemyHitsPlayer, null, this);

        this.physics.arcade.overlap(blueEnemyBullets, player, this.enemyHitsPlayer, null, this);

        if (!player.alive && gameOver.visible === false) {
            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = this.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();

            function setResetHandlers() {
                tapRestart = this.SpaceShooter.FirstGameStateHard.input.onTap.addOnce(_restart, this);
                spaceRestart = fireButton.onDown.addOnce(_restart, this);
                function _restart() {
                    tapRestart.detach();
                    spaceRestart.detach();
                    this.SpaceShooter.FirstGameStateHard.restart(this.SpaceShooter.FirstGameStateHard.game);
                }
            }
        }
    },

    fireBullet:function () {
        switch (player.weaponLevel) {
            case 1:
                if (this.time.now > bulletTimer) {
                    var BULLET_SPEED = 400;
                    var BULLET_SPACING = 250;
                    var bullet = bullets.getFirstExists(false);

                    if (bullet) {
                        var bulletOffset = 20 * Math.sin(this.math.degToRad(player.angle));
                        bullet.reset(player.x + bulletOffset, player.y);
                        bullet.angle = player.angle;
                        this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                        bullet.body.velocity.x += player.body.velocity.x;

                        bulletTimer = this.time.now + BULLET_SPACING;
                    }
                }
                break;

            case 2:
                if (this.time.now > bulletTimer) {
                    var BULLET_SPEED = 400;
                    var BULLET_SPACING = 550;


                    for (var i = 0; i < 3; i++) {
                        var bullet = bullets.getFirstExists(false);
                        if (bullet) {
                            var bulletOffset = 20 * Math.sin(this.game.math.degToRad(player.angle));
                            bullet.reset(player.x + bulletOffset, player.y);
                            var spreadAngle;
                            if (i === 0) spreadAngle = -20;
                            if (i === 1) spreadAngle = 0;
                            if (i === 2) spreadAngle = 20;
                            bullet.angle = player.angle + spreadAngle;
                            this.game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                            bullet.body.velocity.x += player.body.velocity.x;
                        }
                        bulletTimer = this.time.now + BULLET_SPACING;
                    }
                }
        }
    },

    createGreenEnemies:function(){
        greenEnemies = this.add.group();
        greenEnemies.enableBody = true;
        greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        greenEnemies.createMultiple(50, 'enemy-green');
        greenEnemies.setAll('anchor.x', 0.5);
        greenEnemies.setAll('anchor.y', 0.5);
        greenEnemies.setAll('scale.x', 0.5);
        greenEnemies.setAll('scale.y', 0.5);
        greenEnemies.setAll('angle', 180);
        greenEnemies.forEach(function (enemy) {
            this.SpaceShooter.FirstGameStateHard.addEnemyEmitterTrail(enemy);
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.damageAmount = 20;
            enemy.events.onKilled.add(function () {
                enemy.trail.kill();
            });
        });



        this.launchGreenEnemy();
    },

    launchGreenEnemy:function() {
        var MIN_ENEMY_SPACING = 100;
        var MAX_ENEMY_SPACING = 1000;
        var ENEMY_SPEED = 500;
        var enemy = greenEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(this.rnd.integerInRange(0, this.game.width), -20);
            enemy.body.velocity.x = this.rnd.integerInRange(-300, 300);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;
        }
        this.game.time.events.add(this.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), this.launchGreenEnemy,this);
    },

    launchBlueEnemy:function() {
        var startingX = this.game.rnd.integerInRange(100, this.game.width - 100);
        var verticalSpeed = 180;
        var spread = 60;
        var frequency = 70;
        var verticalSpacing = 70;
        var numEnemiesInWave = 5;
        var numWaves = 2;

        for (var i = 0; i < numEnemiesInWave; i++) {
            var enemy = blueEnemies.getFirstExists(false);
            if (enemy) {
                enemy.startingX = startingX;
                enemy.reset(this.game.width / 2, -verticalSpacing * i);
                enemy.body.velocity.y = verticalSpeed;

                var bulletSpeed = 400;
                var firingDelay = 2000;
                enemy.bullets = 1;
                enemy.lastShot = 0;

                enemy.update = function () {
                    this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

                    bank = Math.cos((this.y + 60) / frequency)
                    this.scale.x = 0.5 - Math.abs(bank) / 8;
                    this.angle = 180 - bank * 2;

                    enemyBullet = blueEnemyBullets.getFirstExists(false);
                    if (enemyBullet &&
                        this.alive &&
                        this.bullets &&
                        this.y > this.game.width / 8 &&
                        this.game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = this.game.time.now;
                        this.bullets--;
                        enemyBullet.reset(this.x, this.y + this.height / 2);
                        enemyBullet.damageAmount = this.damageAmount;
                        var angle = this.game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                        enemyBullet.angle = this.game.math.radToDeg(angle);
                    }

                    if (this.y > this.game.height + 200) {
                        this.kill();
                        this.y = -20;
                    }
                };
            }
        }

        blueEnemyLaunchTimer = this.game.time.events.add(this.game.rnd.integerInRange(blueEnemySpacing, blueEnemySpacing + 4000), this.launchBlueEnemy, this);
    },

    launchBoss: function() {
        boss.reset(this.game.width / 2, -boss.height);
        booster.start(false, 1000, 10);
        boss.health = 1501;
        bossBulletTimer = this.time.now + 1000;
    },

    addEnemyEmitterTrail:function(enemy) {
        var enemyTrail = this.game.add.emitter(enemy.x, enemy.y - 10, 100);
        enemyTrail.width = 10;
        enemyTrail.makeParticles('explosion', [1, 2, 3, 4, 5]);
        enemyTrail.setXSpeed(20, -20);
        enemyTrail.setRotation(50, -50);
        enemyTrail.setAlpha(0.4, 0, 800);
        enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
        enemy.trail = enemyTrail;
    },


    shipCollide:function (player, enemy) {
        enemy.kill();

        player.damage(enemy.damageAmount);
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
        }
    },


    hitEnemy:function(enemy, bullet) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        if (enemy.finishOff && enemy.health < 5) {
            enemy.finishOff();
        } else {
            enemy.damage(enemy.damageAmount);
        }
        bullet.kill();

        score += enemy.damageAmount * 10;
        scoreText.setText('Score: ' + score);

        greenEnemySpacing *= 0.9;

        if (!blueEnemyLaunched && score > 1000) {
            blueEnemyLaunched = true;
            this.launchBlueEnemy();
            this.launchBlueEnemy();
            greenEnemySpacing *= 2;
        }

        if (!bossLaunched && score > 15000) {
            greenEnemySpacing = 5000;
            blueEnemySpacing = 12000;
            this.time.events.add(2000, function () {
                bossLaunched = true;
                this.SpaceShooter.FirstGameStateHard.launchBoss();
            });
        }

        if (score > 5000 && player.weaponLevel < 2) {
            player.weaponLevel = 2;
        }
    },

    bossHitTest:function(boss, bullet) {
        if ((bullet.x > boss.x + boss.width / 5 &&
            bullet.y > boss.y) ||
            (bullet.x < boss.x - boss.width / 5 &&
                bullet.y > boss.y)) {
            return false;
        } else {
            return true;
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
        }
    },

    addRay:function(leftRight) {
        ray = this.add.sprite(leftRight * boss.width * 0.75, 0, 'deathRay');
        ray.alive = false;
        ray.visible = false;
        boss.addChild(ray);
        ray.crop({x: 0, y: 0, width: 40, height: 40});
        ray.anchor.x = 0.5;
        ray.anchor.y = 0.5;
        ray.scale.x = 2.5;
        ray.damageAmount = boss.damageAmount;
        this.physics.enable(ray, Phaser.Physics.ARCADE);
        ray.body.setSize(ray.width / 5, ray.height / 4);
        ray.update = function () {
            this.alpha = this.game.rnd.realInRange(0.6, 1);
        };
        boss['ray' + (leftRight > 0 ? 'Right' : 'Left')] = ray;
    },


    restart:function(game) {
        greenEnemies.callAll('kill');
        game.time.events.remove(greenEnemyLaunchTimer);
        game.time.events.add(1000, game.launchGreenEnemy, this);
        blueEnemies.callAll('kill');
        blueEnemyBullets.callAll('kill');
        game.time.events.remove(blueEnemyLaunchTimer);
        boss.kill();
        booster.kill();
        game.time.events.remove(bossLaunchTimer);

        blueEnemies.callAll('kill');
        game.time.events.remove(blueEnemyLaunchTimer);
        player.weaponLevel = 1;
        player.revive();
        player.health = 100;
        shields.setText('Shields: ' + Math.max(player.health, 0) + '%');
        score = 0;
        scoreText.setText('Score: ' + score);
        gameOver.visible = false;
        youWin.visible=false;

        greenEnemySpacing = 1000;
        blueEnemyLaunched = false;
        bossLaunched = false;
        game.state.start('TesteState');
    }
};