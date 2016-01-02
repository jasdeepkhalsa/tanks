/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>

class Game {
    private game;
    private tank;
    private bullet;
    private target;
    private turret;
    private dome;
    private bulletX;
    private bulletY;
    private turretX;
    private turretY;
    private domeX;
    private domeY;
    private domeAngleLeft;
    private domeAngle;
    private turretAngleRight;
    private turretAngleLeft;
    private bulletAngle;
    private bulletVelocityXLeft = -100;
    private bulletVelocityXRight = 100;
    private bulletVelocityY = 0
    private speed = 100;
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

    constructor() {
        this.game = new Phaser.Game(
            800,
            600,
            Phaser.AUTO,
            '',
            {
                preload: this.preload,
                create: this.create,
                update: this.update
            }
        );
    }

    preload() {
        this.game.load.pack('start', 'assets/pack.json');
    }

    create() {
        // General game settings
        this.spawnNumber = 2; // this.game.rnd.integerInRange(5, 10);
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.game.stage.backgroundColor = '#2f0f1c';
        this.game.add.tileSprite(0, 0, 1920, 1920, 'background');

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

        // Set these variables
        this.turretX = this.tank.position.x + this.tank.width - 45;
        this.turretY = this.tank.position.y + 10;
        this.turretAngleRight = 270;
        this.turretAngleLeft = 90;
        this.domeX = this.tank.position.x + this.tank.width - 70;
        this.domeY = this.tank.position.y + 10;
        this.domeAngleLeft = 60;
        this.domeAngle = -60;
        this.bulletX = this.tank.position.x + this.tank.width + 10;
        this.bulletY = this.tank.position.y - 5;
        this.bulletAngle = 180;
        
        this.turret = this.game.turrets.create(
            this.turretX,
            this.turretY,
            'tanks',
            'main-turret.png'
        );
        this.dome = this.game.domes.create(
            this.domeX,
            this.domeY,
            'tanks',
            'bottom-turret-connector.png'
        );
        this.dome.angle = this.domeAngle;
        for (var i=0;i<this.spawnNumber;i++) {
            this.target = this.game.targets.create(
                this.game.rnd.integerInRange(64, this.game.world.width),
                this.game.rnd.integerInRange(64, this.game.world.height),
                'target'
            );
            this.target.health = 1;    
        };

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
    }

    update() {
        var that = this;
        
        // Set these variables
        this.turretX = this.tank.position.x + this.tank.width - 45;
        this.turretY = this.tank.position.y + 10;
        this.domeX = this.tank.position.x + this.tank.width - 70;
        this.domeY = this.tank.position.y + 10;
        this.domeAngleLeft = -90;
        this.domeAngle = -60;
        this.bulletX = this.tank.position.x + this.tank.width + 10;
        this.bulletY = this.tank.position.y - 5;
        
        if (this.spaceKey.isDown && this.spaceKey.downDuration(1000) && !this.fired) {
            this.bullet = this.game.bullets.create(
                this.bulletX,
                this.bulletY,
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
            this.bullet.body.velocity.y = this.bulletVelocityY;

            if (this.left) {
                this.bullet.position.x = this.tank.position.x - 10;
                this.bullet.position.y = this.tank.position.y + 28;
                this.bullet.angle = this.bulletAngle;
                this.bullet.body.velocity.x = -100;
            } else {
                this.bullet.body.velocity.x = 100;
            }
        }
        
        if (this.leftKey.isDown && !this.fired) {
            this.turret.position.x = this.tank.position.x + 40;
            this.dome.position.x = this.tank.position.x + 30;
            this.dome.position.y = this.domeY + 10;
            this.tank.body.velocity.x = this.turret.body.velocity.x = this.dome.body.velocity.x = -1000;
            this.tank.animations.play('left');
            this.left = true;
            this.turret.angle = this.turretAngleLeft;
            this.dome.angle = this.domeAngleLeft;
        } else if (this.rightKey.isDown && !this.fired) {
            this.turret.position.x = this.turretX;
            this.dome.position.x = this.domeX;
            this.dome.position.y = this.domeY;
            this.tank.body.velocity.x = this.turret.body.velocity.x = this.dome.body.velocity.x = 1000;
            this.tank.animations.play('right');
            this.left = false;
            this.turret.angle = this.turretAngleRight;
            this.dome.angle = this.domeAngle;
        } else if (this.upKey.isDown && this.upKey.downDuration(1000) && !this.fired) {
            this.turret.angle -= 1;
            this.turretAngleRight -= 1;
            this.turretAngleLeft -= 1;
            this.bulletAngle -= 1;
            this.bulletVelocityY -= 1;
        } else if (this.downKey.isDown && this.downKey.downDuration(1000) && !this.fired) {
            this.turret.angle += 1;
            this.turretAngleRight += 1;
            this.turretAngleLeft += 1;
            this.bulletAngle += 1;
            this.bulletVelocityY += 1;
        } else {
            if (this.left) {
                this.tank.animations.play('idle-left');
                this.turret.angle = this.turretAngleLeft;
                this.turret.position.x = this.tank.position.x + 40;;
                this.dome.position.x = this.tank.position.x + 30;
                this.dome.position.y = this.domeY + 10;
            } else {
                this.tank.animations.play('idle-right');
                this.turret.angle = this.turretAngleRight;
                this.dome.angle = this.domeAngle;
                this.dome.position.x = this.domeX;
                this.dome.position.y = this.domeY;
            }
            this.tank.body.velocity.x = 0;
            this.turret.body.velocity.x = 0;
            this.dome.body.velocity.x = 0;
        }

     this.game.physics.arcade.overlap(
         this.game.bullets,
         this.game.targets,
         function(bullet, target){
             target.damage(1);
             bullet.destroy();
             that.fired = false;
             that.game.camera.follow(that.tank);
         }
     );
    }
}