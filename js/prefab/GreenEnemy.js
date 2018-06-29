var SpaceShooter = SpaceShooter || {};

SpaceShooter.Enemy = function (game,x,y,key,health,enemyBullets, points) {
    Phaser.Sprite.call(this,game,x,y,key);

    this.game = game;
    this.anchor.setTo(0.5);
    this.health = health;
    this.angle = 180;

    this.pi = 0;
    this.path = [];
    this.createPath(points);

    this.game.physics.arcade.enable(this);
    this.enemyBullets = enemyBullets;

    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();

    this.scheduleShotting();
};

SpaceShooter.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceShooter.Enemy.prototype.constructor = SpaceShooter.Enemy;


SpaceShooter.Enemy.prototype.update = function () {

    if (this.path.length > 0){
        this.position.x = this.path[this.pi].x;
        this.position.y = this.path[this.pi].y;
        this.pi++;

        if (this.pi >= this.path.length){
            this.pi = 0;
        }

    }else{
        if (this.position.x < 0.05 * this.game.world.width){
            this.position.x = 0.05 * this.game.world.width + 2;
            this.body.velocity.x *= -1;
        }else if (this.position.x > 0.95 * this.game.world.width){
            this.position.x = 0.95 * this.game.world.width - 2;
            this.body.velocity.x *= -1;
        }
    }

    if (this.position.y > this.game.world.height){
        this.kill();
    }
};


SpaceShooter.Enemy.prototype.scheduleShotting =  function () {
    this.shoot();

    this.enemyTimer.add(Phaser.Timer.SECOND *0.15,this.scheduleShotting, this);
};

SpaceShooter.Enemy.prototype.shoot = function () {

    if(this.alive){
        var bullet = this.enemyBullets.getFirstExists(false);
        if (!bullet){
            bullet = new SpaceShooter.EnemyBullet(this.game,this.x,this.bottom);
            bullet.damageAmount = 50;
            this.enemyBullets.add(bullet);
        }else{
            bullet.reset(this.x,this.bottom);
        }

        bullet.body.velocity.y = 600;
    }
};

SpaceShooter.Enemy.prototype.createPath = function (points) {

    if (points.x && points.x.length > 0){

        points.x.forEach(function (t,i,array) {
            array[i] = t / 640 * this.game.world.width;
        },this);

        x = 1 /500;
        for (var i = 0; i <= 1; i += x)
        {
            var px = Phaser.Math.catmullRomInterpolation(points.x,i);
            var py = Phaser.Math.catmullRomInterpolation(points.y,i);
            this.path.push({x: px, y: py});
        }
    }else{
        this.path = [];
    }
};