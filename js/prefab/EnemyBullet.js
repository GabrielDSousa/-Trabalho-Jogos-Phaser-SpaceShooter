var SpaceShooter = SpaceShooter || {};

SpaceShooter.EnemyBullet = function (game,x,y) {
    Phaser.Sprite.call(this,game,x,y,'enemybullet');

    this.crop({x: 0, y: 0, width: 40, height: 40});
    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

SpaceShooter.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceShooter.EnemyBullet.prototype.constructor = SpaceShooter.EnemyBullet;