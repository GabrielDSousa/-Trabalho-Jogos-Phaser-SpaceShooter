var SpaceShooter = SpaceShooter || {};

//initiate the Phaser framework
SpaceShooter.game = new Phaser.Game('100%', '100%', Phaser.AUTO);

SpaceShooter.game.state.add('FirstGameStateEasy', SpaceShooter.FirstGameStateEasy);
SpaceShooter.game.state.add('FirstGameStateMedium', SpaceShooter.FirstGameStateMedium);
SpaceShooter.game.state.add('FirstGameStateHard', SpaceShooter.FirstGameStateHard);
SpaceShooter.game.state.add('MenuState', SpaceShooter.MenuState);
SpaceShooter.game.state.start('MenuState');