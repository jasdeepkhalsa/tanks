/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>

class Play {
    private tank;
    private bullet;
    private target;
    private turret;
    private dome;
    private text;
    private framerate = 16;
    private left: boolean = false;
    private upKey;
    private downKey;
    private leftKey;
    private rightKey;
    private spaceKey;
    private fired: boolean = false;
    private spawnNumber: number;
    private changes;

    constructor(private game) {
    }

    defaults(tank = this.tank) {
        var defaults = {
            dome: {
                right: { x: tank.position.x + tank.width - 70, y: tank.position.y + 10, angle: -60 },
                left: { x: tank.position.x + 30, y: tank.position.y + 20, angle: -90 }
            },
            turret: {
                right: { x: tank.position.x + tank.width - 45, y: tank.position.y + 10, angle: 270 },
                left: { x: tank.position.x + 40, y: null, angle: 90 }
            },
            bullet: {
                right: { x: tank.position.x + tank.width + 10, y: tank.position.y - 5, angle: 0, velocityX: 100, velocityY: 0},
                left: { x: tank.position.x - 10, y: tank.position.y + 28, angle: 180, velocityX: -100 , velocityY: 0}
            },
            general: {
                right: { velocityX: 1000 },
                left: { velocityX: -1000 },
                up: { angleIncrement: -1 },
                down: { angleIncrement: 1 }
            }
        };
        return defaults;
    }

    preload() {}

    create() {
        // General game settings
        this.spawnNumber = this.game.rnd.integerInRange(5, 10);
        this.game.world.setBounds(0, 0, 1920, 600);
        this.game.stage.backgroundColor = '#2f0f1c';
        this.game.add.tileSprite(0, 0, 1920, 600, 'background');

        //  Register the keys.
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following keys from propagating up to the browser
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

        // Physics groups
        this.game.tanks = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.world,
            'tanks'
        );
        this.game.turrets = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.world,
            'turrets'
        );
        this.game.domes = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.world,
            'domes'
        );
        this.game.targets = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.world,
            'targets'
        );
        this.game.bullets = this.game.add.physicsGroup(
            Phaser.Physics.ARCADE,
            this.game.world,
            'bullets'
        );

        // Sprites
        this.tank = this.game.tanks.create(
            this.game.world.centerX,
            this.game.world.centerY,
            'tanks',
            'left-1.png'
        );
        this.turret = this.game.turrets.create(
            this.defaults().turret.right.x,
            this.defaults().turret.right.y,
            'tanks',
            'main-turret.png'
        );
        this.dome = this.game.domes.create(
            this.defaults().dome.right.y,
            this.defaults().dome.right.y,
            'tanks',
            'bottom-turret-connector.png'
        );
        this.dome.angle = this.defaults().dome.right.angle;
        for (var i=0;i<this.spawnNumber;i++) {
            this.target = this.game.targets.create(
                this.game.rnd.integerInRange(64, this.game.world.width - 64),
                this.game.rnd.integerInRange(64, this.game.world.height - 64),
                'target'
            );
            this.target.health = 1;
        };

        // Collisions
        this.tank.body.collideWorldBounds = true;
        this.turret.body.collideWorldBounds = true;
        this.dome.body.collideWorldBounds = true;

        // Animations
        this.tank.animations.add(
            'idle-left',
            ['left-1.png'],
            this.framerate,
            true,
            false
        );
        this.tank.animations.add(
            'idle-right',
            ['right-1.png'],
            this.framerate,
            true,
            false
        );
        this.tank.animations.add(
            'left',
            ['left-1.png','left-2.png','left-3.png','left-4.png'],
            this.framerate,
            true,
            false
        );
        this.tank.animations.add(
            'right',
            ['right-1.png','right-2.png','right-3.png','right-4.png'],
            this.framerate,
            true,
            false
        );

        // Camera
        this.game.camera.follow(this.tank);

        // Changing default
        this.changes = this.defaults();
    }

    update() {
        if (this.spaceKey.isDown && this.spaceKey.downDuration(1000) && !this.fired) {
            this.bullet = this.game.bullets.create(
                this.defaults().bullet.right.x,
                this.defaults().bullet.right.y,
                'tanks',
                'shell.png'
            );
            this.bullet.animations.add(
                'idle',
                ['shell.png'],
                this.framerate,
                false,
                false
            );
            this.bullet.animations.add(
                'fire',
                ['fire1.png','fire2.png','fire3.png','fire4.png','fire5.png','fire6.png','fire7.png','fire8.png'],
                this.framerate,
                false,
                false
            )
            .onComplete
            .add(() => this.bullet.animations.play('idle'));
            this.game.camera.follow(this.bullet);
            this.bullet.events.onKilled.add(() => {
                this.fired = false;
                this.game.camera.follow(this.tank);
            }, this);
            this.bullet.animations.play('fire');
            this.fired = true;
            this.bullet.checkWorldBounds = true;
            this.bullet.outOfBoundsKill = true;
            this.bullet.body.velocity.y = this.changes.bullet.right.velocityY;

            if (this.left) {
                this.bullet.position.x = this.defaults().bullet.left.x;
                this.bullet.position.y = this.changes.bullet.left.y;
                this.bullet.angle = this.changes.bullet.left.angle;
                this.bullet.body.velocity.x = this.defaults().bullet.left.velocityX;
            } else {
                this.bullet.position.y = this.changes.bullet.right.y;
                this.bullet.angle = this.changes.bullet.right.angle;
                this.bullet.body.velocity.x = this.defaults().bullet.right.velocityX;
            }
        }

        if (this.leftKey.isDown && !this.fired) {
            this.left = true;
            this.tank.animations.play('left');
            this.turret.position.x = this.defaults().turret.left.x;
            this.dome.position.x = this.defaults().dome.left.x;
            this.dome.position.y = this.defaults().dome.left.y;
            this.turret.angle = this.changes.turret.left.angle;
            this.dome.angle = this.defaults().dome.left.angle;
            this.tank.body.velocity.x = this.turret.body.velocity.x = this.dome.body.velocity.x = this.defaults().general.left.velocityX;
        } else if (this.rightKey.isDown && !this.fired) {
            this.left = false;
            this.tank.animations.play('right');
            this.turret.position.x = this.defaults().turret.right.x;
            this.dome.position.x = this.defaults().dome.right.x;
            this.dome.position.y = this.defaults().dome.right.y;
            this.turret.angle = this.changes.turret.right.angle;
            this.dome.angle = this.defaults().dome.right.angle;
            this.tank.body.velocity.x = this.turret.body.velocity.x = this.dome.body.velocity.x = this.defaults().general.right.velocityX;
        } else if (this.upKey.isDown && this.upKey.downDuration(1000) && !this.fired) {
            this.changes.turret.right.angle += this.changes.general.up.angleIncrement;
            this.changes.turret.left.angle += this.changes.general.down.angleIncrement;
            this.changes.bullet.right.angle += this.changes.general.up.angleIncrement;
            this.changes.bullet.left.angle += this.changes.general.down.angleIncrement;
            this.changes.bullet.right.velocityY += this.changes.general.up.angleIncrement;
            this.changes.bullet.left.y += this.changes.general.up.angleIncrement;
            this.changes.bullet.right.y += this.changes.general.up.angleIncrement;
        } else if (this.downKey.isDown && this.downKey.downDuration(1000) && !this.fired) {
            this.changes.turret.right.angle += this.changes.general.down.angleIncrement;
            this.changes.turret.left.angle += this.changes.general.up.angleIncrement;
            this.changes.bullet.right.angle += this.changes.general.down.angleIncrement;
            this.changes.bullet.left.angle += this.changes.general.up.angleIncrement;
            this.changes.bullet.right.velocityY += this.changes.general.down.angleIncrement;
            this.changes.bullet.left.y += this.changes.general.down.angleIncrement;
            this.changes.bullet.right.y += this.changes.general.down.angleIncrement;
        } else {
            this.tank.body.velocity.x = 0;
            this.turret.body.velocity.x = 0;
            this.dome.body.velocity.x = 0;
        }

        if (this.left) {
            this.tank.animations.play('idle-left');
            this.turret.position.x = this.defaults().turret.left.x;
            this.dome.position.x = this.defaults().dome.left.x;
            this.dome.position.y = this.defaults().dome.left.y;
            this.turret.angle = this.changes.turret.left.angle;
        } else {
            this.tank.animations.play('idle-right');
            this.dome.angle = this.defaults().dome.right.angle;
            this.dome.position.x = this.defaults().dome.right.x;
            this.dome.position.y = this.defaults().dome.right.y;
            this.turret.angle = this.changes.turret.right.angle;
        }

     this.game.physics.arcade.overlap(
         this.game.bullets,
         this.game.targets,
         (bullet, target) => {
             target.damage(1);
             bullet.kill();
             this.fired = false;
             this.game.camera.follow(this.tank);
         }
     );
    }
}

export = Play;