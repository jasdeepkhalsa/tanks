/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>

class End {
    private text;
    private subtext;

    constructor(private game) {}
    preload() {}
    textStyle(size = 64, colour = '#FFF') {
        return { font: size+'px Monaco, Ubuntu Mono, Menlo, Consolas, monospace', fill: colour }
    }
    create() {
        // Reset game size & camera
        this.game.world.removeAll();
        this.game.world.setBounds(0, 0, 800, 600);
        this.game.camera.visible = false;

        // Decorate the screen
        this.game.stage.backgroundColor = "#4488AA";
        this.text = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, 'Game Over', this.textStyle());
        this.subtext = this.game.add.text(this.game.world.width / 2, (this.game.world.height / 2) + 50, 'Tap to Play Again', this.textStyle(32));
        this.text.anchor.setTo(0.5, 0.5);
        this.subtext.anchor.setTo(0.5, 0.5);
    }
    update() {
        this.game.input.onTap.add(() => {
            this.game.state.start('Play');
        });
    }
}

export = End;