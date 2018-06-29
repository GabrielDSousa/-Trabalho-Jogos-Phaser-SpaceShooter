var SpaceShooter = SpaceShooter || {};

SpaceShooter.PlayerBullet = function (game,x,y) {
    Phaser.Sprite.call(this,game,x,y,'bullet');

    this.anchor.setTo(0.5, 1);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.damageAmount = 10;
};

SpaceShooter.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceShooter.PlayerBullet.prototype.constructor = SpaceShooter.PlayerBullet;