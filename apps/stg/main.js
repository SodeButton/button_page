/**
 * Author : Button501
 * License : MIT License
 */

const config = {
	type: Phaser.AUTO,
	parent: 'canvas',
	width: 800,
	height: 600,
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

class Player extends Phaser.Physics.Arcade.Sprite {
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

let player;
let speed = 4;
let offset = new Object();
offset.x = 0;
offset.y = 0;

let enemyList;
let enemySpawnTime = 0;

function preload() {
	//this.load.setBaseURL('https://sodebutton.github.io');
	this.load.image("player", "./Resources/Sprites/player.png");
	this.load.image("enemy", "./Resources/Sprites/enemy.png");
}

function create() {
	//player = this.add.image(400, 300, 'player');

	player = new Player(this, 300, 400, 'player', 0);
	enemyList = this.add.group();
	//player.setVelocity(100, 200);
	//player.setBounce(1, 1);
	//player.setCollideWorldBounds(true);
}

function update() {
	var cursors = this.input.keyboard.createCursorKeys();

	this.input.on('pointerdown', function(pointer) {
		offset.x = player.x -pointer.x;
		offset.y = player.y - pointer.y;
	});

	var pointer = this.input.activePointer;
	if (pointer.isDown) {
		player.x = pointer.x + offset.x;
		player.y = pointer.y + offset.y;

		if(player.x < player.width / 2) player.x = player.width / 2;
		if(player.x > this.scale.width - (player.width / 2)) player.x = this.scale.width - (player.width / 2);
		if(player.y < player.height / 2) player.y = player.height / 2;
		if(player.y > this.scale.height - (player.height / 2)) player.y = this.scale.height - (player.height / 2);
		
	}

	enemySpawnTime--;
	if(enemySpawnTime <= 0) {
		enemyList.add(this.add.image(Math.random() * (800-32) + 16, 0, 'enemy'));
		enemySpawnTime += 120;
	}

	enemyList.getChildren().forEach(enemy => {
		enemy.y += 2;

		if(enemy.y > 616) {

		}
	});
}