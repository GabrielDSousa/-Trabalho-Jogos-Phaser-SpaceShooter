var game = new Phaser.Game(800,600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});
var player;
var starfield;

function preload() {
    //Pré carregando as imagens do que será utilizado
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/player.png');
}
function create() {
    //Criando o fundo da tela que será rolável
    starfield = game.add.tileSprite(0,0,800,600,'starfield');

    //Criando o herói do jogo
    player = game.add.sprite(400,500,`ship`);
    player.anchor.setTo(0.5, 0.5);
}
function update() {
    //Criando ilusão de movimento com o fundo movimentandio
    starfield.tilePosition.y +=2;
}
function render() {
}
