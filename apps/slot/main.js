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

var left_slot = new Array();

function preload() {
    this.load.image("seven", "./Resources/Sprites/slot_seven.png");
    this.load.image("main", "./Resources/Sprites/slot_main.png");
}

function create() {
    left_slot[0] = this.add.image(400, 200, 'seven');
    left_slot[1] = this.add.image(400, 300, 'seven');
    left_slot[2] = this.add.image(400, 400, 'seven');
    this.add.image(400, 300, 'main');

}

function update() {
    left_slot.forEach(slot => {
        slot.y += 2;
        if(slot.y >= 500) slot.y = 200;
    });
}