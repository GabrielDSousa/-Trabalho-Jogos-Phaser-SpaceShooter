var SpaceShooter = SpaceShooter || {};
var teste;
var easy;
var medium;
var hard;
var background;

SpaceShooter.MenuState = {
    preload:function() {

    this.game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
    this.game.load.image('background','assets/starfield.png');

    },

    create: function() {

        this.game.stage.backgroundColor = '#182d3b';

        background = this.game.add.tileSprite(0, 0, 2000, 2000, 'background');

        //teste = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY, 'button', this.loadTeste(), this, 2, 1, 0);


        easy = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY + 93, 'button', this.loadEasy, this, 2, 1, 0);


        medium = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY + 193, 'button', this.loadMedium, this, 2, 1, 0);


        hard = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY + 293, 'button', this.loadHard, this, 2, 1, 0);


        var style1 = { font: "28px Press Start 2P", fill: "#fff", align: "center"};
        var titulo = this.game.add.text(this.game.world.centerX, 100, "- Space Shooter -\nsobreviva\na essa fuga", style1);
        titulo.anchor.set(0.5);
        titulo.addColor('#ff000d', 17);
        titulo.addColor('#ffffff', 26);
        titulo.addColor('#7cfff2', 33);
        titulo.addColor('#ffffff', 37);


        var style2 = { font: "16px Press Start 2P", fill: "#fff", align: "left"};
        var controlesTeclado = this.game.add.text(300, this.game.world.centerY, "- Controles teclado -\nRetire o mouse da tela\nuse o a seta esquerda e direita\npara para mover para os lados\ne clique com o espaço para atirar", style2);
        controlesTeclado.anchor.set(0.5);
        controlesTeclado.addColor('#7cfff2', 12);
        controlesTeclado.addColor('#ffffff', 20);


        var style3 = { font: "16px Press Start 2P", fill: "#fff", align: "right"};
        var controlesMouse = this.game.add.text(this.game.world.width - 290, this.game.world.centerY, "- Controles mouse -\nUse o mouse para mover\npara esquerda e direita\ne clique com o botão esquerdo\npara atirar", style3);
        controlesMouse.anchor.set(0.5);
        controlesMouse.addColor('#7cfff2', 12);
        controlesMouse.addColor('#ffffff', 18);

        var steste = { font: "16px Press Start 2P", fill: "#fff", align: "center"};
        var tteste = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 35 , "Teste", steste);
        tteste.anchor.set(0.5);
        tteste.addColor('#7cfff2', 12);
        tteste.addColor('#ffffff', 18);

        var seasy = { font: "16px Press Start 2P", fill: "#fff", align: "center"};
        var teasy = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 128 , "Fácil", seasy);
        teasy.anchor.set(0.5);
        teasy.addColor('#7cfff2', 12);
        teasy.addColor('#ffffff', 18);

        var smedium = { font: "16px Press Start 2P", fill: "#fff", align: "center"};
        var tmedium = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 228, "Médio", smedium);
        tmedium.anchor.set(0.5);
        tmedium.addColor('#7cfff2', 12);
        tmedium.addColor('#ffffff', 18);

        var shard = { font: "16px Press Start 2P", fill: "#fff", align: "center"};
        var thard = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 328, "Difícil", shard);
        thard.anchor.set(0.5);
        thard.addColor('#7cfff2', 12);
        thard.addColor('#ffffff', 18);

    },

    loadTeste:function() {

        this.state.start('TesteState');

    },

    loadEasy:function() {

        this.state.start('FirstGameStateEasy');

    },
    loadMedium:function() {

        this.state.start('FirstGameStateMedium');

    },
    loadHard:function() {

        this.state.start('FirstGameStateHard');

    }
};