/**
 * Author : Button501
 * License : MIT License
 */

const config = {
	type: Phaser.AUTO,
	parent: 'canvas',
	width: 800,
	height: 1200,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	}, 
	render: {
		pixelArt: true
	},
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

class Block extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
	  super(scene, x, y, texture, frame);
	  this.scene = scene;
	  //シーンのDisplayListとUpdateListにゲームを追加する
	  this.scene.add.existing(this);
	  //Arcade物理ボディをゲームオブジェクトに追加する
	  this.scene.physics.world.enable(this);
	  this.setTexture(texture, frame);
	  this.setPosition(x, y);
	  this.setSize(1, 1);
	  this.setOffset(0, 0);
	}
}

let bar;
let ball;
let reflect;
let blocks;

function preload() {
	this.load.setPath("./Resources");
	this.load.image("bar", "./Sprites/bar.png");
	this.load.image("ball", "./Sprites/ball.png");
	this.load.spritesheet("blocks", "./Sprites/blocks.png", { frameWidth: 160, frameHeight: 64});
	this.load.audio("reflect", [
		"./Audios/reflect.mp3",
		"./Audios/reflect.ogg"
	]);

}

function create() {
	bar = this.physics.add.image(300, 1100, "bar");
	bar.body.immovable = true;
	bar.scaleX = 1.0;
	bar.scaleY = 0.5;

	ball = this.physics.add.image(300, 650, "ball");
	ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
	ball.checkWorldBounds = true;
	ball.speed = 500;

	var deg = Math.random() * 120 + 30;
	ball.dx = Math.cos(deg * Math.PI / 360) * ball.speed;
	ball.dy = -Math.sin(deg * Math.PI / 360) * ball.speed;
	ball.body.velocity.set(ball.dx, ball.dy);

	this.physics.world.checkCollision.down = false;

	//reflect = this.sound.add("reflect");
	blocks = this.physics.add.staticGroup();
	blocks.scaleX = 0.5;
	blocks.scaleY = 0.5;
	for(var i = 0; i < 10; i++) {
		for(var j = 0; j < 6; j++) {
			var block = blocks.create(i * 80 + 40, j * 32 + 16, "blocks");
			block.scaleX = 0.5;
			block.scaleY = 0.5;
			block.width = 80;
			block.height = 32;
		}
	}
}

function update() {
	this.physics.add.collider(ball, bar, hitbar, null, this);
	this.physics.add.collider(ball, blocks, (hitObject1, hitObject2) => {
		hitObject2.destroy();
		console.log(hitObject2)
		
	}, null, this);

	var pointer = this.input.activePointer;
	if (pointer.isDown) {
		bar.x = pointer.x;

		if(bar.x < bar.width / 2) bar.x = bar.width / 2;
		if(bar.x > this.scale.width - (bar.width / 2)) bar.x = this.scale.width - (bar.width / 2);
	}

	if(ball.y > this.scale.height + ball.height / 2) {
		this.physics.pause();
	}
}

function hitbar() {
	if(ball.body.velocity.y > 0) {
		var deg = Math.random() * 120 + 30;
		ball.dx = Math.cos(deg * Math.PI / 360) * ball.speed;
		ball.dy = Math.sin(deg * Math.PI / 360) * ball.speed;
		ball.body.velocity.set(ball.dx, ball.dy);

		//reflect.play();
	}
}