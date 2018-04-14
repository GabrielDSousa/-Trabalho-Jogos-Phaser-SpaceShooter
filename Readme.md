# Space Shooter game with phaser

 - Preparing the code with the right dependencies
 At the html file
 ```
 <script src="http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js" type="text/javascript"></script>
 <script src="game.js" type="text/javascript"></script>
 ```
 
 - Starting the project, I instantiate a game with a screen with 800x600 size.
 ```
 var game = new Phaser.Game(800,600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});
 ```
 
 - Preloaded the images that I will use on game.
 ```
 function preload() {
     game.load.image('starfield', 'assets/starfield.png');
     game.load.image('ship', 'assets/player.png');
 }
 ```
- And create the objects on screen
```
 function preload() {
     game.load.image('starfield', 'assets/starfield.png');
     game.load.image('ship', 'assets/player.png');
 }
 ```
 ## Work in progress
 
 ## Built With

* [Phaser](https://phaser.io/) - The web framework used
* [PHPStorm](https://www.jetbrains.com/phpstorm/) - IDE Used
* [XAMPP](https://www.apachefriends.org/pt_br/index.html) - Local server used


## Author

* **Gabriel Ramos de Sousa**

## Acknowledgments

* Work with framework
* Inspiration
* Work with simple games
