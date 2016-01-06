import Intro = require('./intro');
import Play = require('./play');
import End = require('./end');

var game = new Phaser.Game(800,600,Phaser.AUTO,'');
var app = new Play(game);
game.state.add('Intro', app);
game.state.add('Play', app);
game.state.add('End', app);
game.state.start('Intro');