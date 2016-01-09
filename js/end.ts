/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>

class End {
    private text;

    constructor(private game) {}
    preload() {}
    create() {
        this.game.stage.backgroundColor = "#4488AA";
        this.text = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, 'Game Over', { font: '64px Monaco, Ubuntu Mono, Menlo, Consolas, monospace', fill: '#FFF' });
        this.text.anchor.setTo(0.5, 0.5);
    }
    update() {
        this.game.input.onTap.add(() => {
            this.game.state.start('Play');
        });
    }
}

export = End;