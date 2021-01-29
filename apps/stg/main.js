/**
 * Author Button501
 * License MIT
 */

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

const game = new Phaser.Game(config);

let player;
let speed = 4;
let offset = new Object();
offset.x = 0;
offset.y = 0;

let enemyList = new Array();
let enemySpawnTime = 0;

function preload() {
    //this.load.setBaseURL('https://sodebutton.github.io');
    this.load.image("player", "./Resources/Sprites/player.png");
    this.load.image("enemy", "./Resources/Sprites/enemy.png");
}

function create() {
    //player = this.add.image(400, 300, 'player');

    player = this.physics.add.image(400, 100, 'player');

    //player.setVelocity(100, 200);
    //player.setBounce(1, 1);
    player.setCollideWorldBounds(true);
}

function update() {
    var cursors = this.input.keyboard.createCursorKeys();

    if(cursors.left.isDown) {
        player.x -= speed;
        //player.anims.play('left', true);
    }
    if(cursors.right.isDown) {
        player.x += speed;
    }
    if(cursors.up.isDown) {
        player.y -= speed;
    }
    if(cursors.down.isDown) {
        player.y += speed;
    }

    this.input.on('pointerdown', function(pointer) {
        offset.x = player.x -pointer.x;
        offset.y = player.y - pointer.y;
    });

    var pointer = this.input.activePointer;
    if (pointer.isDown) {
        player.x = pointer.x + offset.x;
        player.y = pointer.y + offset.y;
        console.log(player.x);
        console.log(player.y);
    }

    enemySpawnTime--;
    if(enemySpawnTime <= 0) {
        enemyList[enemyList.length] = this.add.image(Math.random() * (800-32) + 16, 0, 'enemy');
        enemySpawnTime += 120;
    }

    enemyList.forEach(enemy => {
        enemy.y += 2;

        if(enemy.y > 616) {

        }
    });
}