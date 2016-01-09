/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>

class Intro {
    private text;

    constructor(private game) {}
    preload() {
        this.game.load.pack('start', 'assets/pack.json');
    }
    textStyle(size = 64, colour = '#FFF') {
        return { font: size+'px Monaco, Ubuntu Mono, Menlo, Consolas, monospace', fill: colour }
    }
    create() {
        this.game.stage.backgroundColor = "#4488AA";
        this.text = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, 'Tap to Start', this.textStyle());
        this.text.anchor.setTo(0.5, 0.5);
    }
    update() {
        this.game.input.onTap.add(() => {
            this.game.state.start('Play');
        });
    }
}

export = Intro;