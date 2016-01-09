import Intro = require('./intro');
import Play = require('./play');
import End = require('./end');

const game = new Phaser.Game(800,600,Phaser.AUTO,'');
const intro = new Intro(game);
const play = new Play(game);
const end = new End(game);

game.state.add('Intro', intro);
game.state.add('Play', play);
game.state.add('End', end);
game.state.start('Intro');