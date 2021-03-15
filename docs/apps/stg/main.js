/**
 * Author : Button501
 * License : MIT License
 */
"use strict";
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
};

const game = new Phaser.Game(config);

function preload() {
	this.load.setPath("./Resources/");
	this.load.image("player", "./Sprites/player.png");
	this.load.image("enemy", "./Sprites/enemy.png");
	this.load.spritesheet("player_bullet", "./Sprites/missile1.png", {frameWidth: 10, frameHeight: 16});
}

function create() {
	this.add.sprite(400, 300, "player_bullet", 0);
}

function update() {

}
