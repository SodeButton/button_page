enchant();

let player;
let enemyList = new Array();
let bulletList = new Array();

let Player = enchant.Class.create(Sprite, {
	initialize: function(width, height) {
		var game = enchant.Game.instance;
		Sprite.call(this, width, height);
		this.timer = 6;
		this.image = game.assets['./Resources/Sprites/player.png'];
		this.addEventListener('enterframe', function() {
			if(this.x < 0) {
				this.x = 0;
			}
			if(this.x > 640 - this.width) {
				this.x = 640 - this.width;
			}
			if(this.y < 0) {
				this.y = 0;
			}
			if(this.y > 640 - this.width) {
				this.y = 640 - this.width;
			}

			this.timer--;

			if(this.timer <= 0) {
				this.timer += 6;
				var bullet = new Bullet(10, 16);
				bullet.image = game.assets['./Resources/Sprites/missile1.png'];
				bullet.x = this.x + 11;
				bullet.y = this.y;
				bullet.dx = 0;
				bullet.dy = -4;
				bullet.angle = 180;
				bullet.frame = 0;
				bullet.tag = "player";
				this.scene.addChild(bullet);
				bulletList.push(bullet);
			}

			for(var i = 0; i < enemyList.length; i++) {
				if(this.intersect(enemyList[i])) {
					var enemy = enemyList[i];
					enemyList = enemyList.filter(n => n != enemy);
					game.rootScene.removeChild(enemy);
					break;
				}
			}

			for(var i = 0; i < bulletList.length; i++) {
				if(this.intersect(bulletList[i]) && bulletList[i].tag == "enemy") {
					var bullet = bulletList[i];
					bulletList = bulletList.filter(n => n != bullet);
					game.rootScene.removeChild(bullet);
					break;
				}
			}
		});
	}
});

let Enemy = enchant.Class.create(Sprite, {
	initialize: function(width, height) {
		var game = enchant.Game.instance;
		Sprite.call(this, width, height);
		this.timer = 60;
		this.ageTime = 0;
		this.useAim = false;
		this.shotType = "Normal";
		this.moveType = "Sinwave";
		this.addEventListener('enterframe', function() {
			this.ageTime++;
			switch(this.moveType) {
				case "Normal":
					this.x += this.dx;
					this.y += this.dy;
					break;
				case "Sinwave":
					this.x += Math.sin(this.ageTime / 50);
					this.y += this.dy;
					break;
			}
			if(this.x < -this.width || this.x > 640 || this.y < -this.height || this.y > 640) {
				enemyList = enemyList.filter(n => n != this);
				this.scene.removeChild(this);
			}

			this.timer--;

			if(this.timer <= 0) {
				var angle = 90;
				if(this.useAim) {
					var direction = {x: player.x - this.x, y: player.y - this.y};
					angle = Math.atan2(direction.y, direction.x) * 180.0 / Math.PI;
				}
				switch (this.shotType) {
					case "Normal":
						var bullet = new Bullet(10, 16);
						bullet.image = game.assets['./Resources/Sprites/missile2.png'];
						bullet.x = this.x + 11;
						bullet.y = this.y + 16;
						bullet.dx = 2 * Math.cos(angle * Math.PI / 180.0);
						bullet.dy = 2 * Math.sin(angle * Math.PI / 180.0);
						bullet.angle = angle - 90;
						bullet.frame = 0;
						bullet.tag = "enemy";
						this.scene.addChild(bullet);
						bulletList.push(bullet);
						this.timer += 120;
						break;

					case "EveryDirection":
						for(var i = 0; i < 360; i+=30) {
							var bullet = new Bullet(10, 16);
							bullet.image = game.assets['./Resources/Sprites/missile2.png'];
							bullet.x = this.x + 11;
							bullet.y = this.y + 16;
							bullet.dx = 2 * Math.cos((angle + i) * Math.PI / 180.0);
							bullet.dy = 2 * Math.sin((angle + i)* Math.PI / 180.0);
							bullet.angle = angle + i - 90;
							bullet.frame = 0;
							bullet.tag = "enemy";
							this.scene.addChild(bullet);
							bulletList.push(bullet);
						}
						this.timer += 120;
						break;
				}
			}

			for(var i = 0; i < bulletList.length; i++) {
				if(this.intersect(bulletList[i]) && bulletList[i].tag == "player") {
					var bullet = bulletList[i];
					bulletList = bulletList.filter(n => n != bullet);
					enemyList = enemyList.filter(n => n != this);
					game.rootScene.removeChild(bullet);
					game.rootScene.removeChild(this);
					break;
				}
			}
		});
	}
});

let Bullet = enchant.Class.create(Sprite, {
	initialize: function(width, height) {
		var game = enchant.Game.instance;
		Sprite.call(this, width, height);
		this.addEventListener('enterframe', function() {
			this.x += this.dx;
			this.y += this.dy;
			this.rotation = this.angle;
			this.frame = 0;
			if(this.x < -this.width || this.x > 640 || this.y < -this.height || this.y > 640) {
				bulletList = bulletList.filter(n => n != this);
				game.rootScene.removeChild(this);
			}
		});
	}
});

window.onload = function() {
	const game = new Game(640, 640);

	game.fps = 60;

	game.preload(
		"./Resources/Sprites/player.png",
		"./Resources/Sprites/enemy.png",
		"./Resources/Sprites/missile1.png",
		"./Resources/Sprites/missile2.png"
	);

	game.rootScene.backgroundColor = "#000";

	game.onload = function() {

		player = new Player(32, 32);

		player.x = 640 / 2 - 16;
		player.y = 640 / 2 - 16;

		game.rootScene.addChild(player);

		var touchPosOrigin = {x: 0, y: 0};
		var touchPosMove = {x: player.x, y: player.y};
		var timer = 300;

		game.rootScene.addEventListener('touchstart', function(e) {
			touchPosOrigin.x = e.x - player.x;
			touchPosOrigin.y = e.y - player.y;
			touchPosMove.x = e.x;
			touchPosMove.y = e.y;
		});

		game.rootScene.addEventListener('touchend', function(e) {
			touchPosOrigin.x = e.x - player.x;
			touchPosOrigin.y = e.y - player.y;
			touchPosMove.x = e.x;
			touchPosMove.y = e.y;
		});

		game.rootScene.addEventListener('touchmove', function(e) {
			touchPosMove.x = e.x;
			touchPosMove.y = e.y;
		});

		player.addEventListener('enterframe', function() {

			this.x = touchPosMove.x - touchPosOrigin.x;
			this.y = touchPosMove.y - touchPosOrigin.y;
		});

		game.rootScene.addEventListener('enterframe', function() {
			timer--;
			if(timer <= 0) {
				timer = 300;
				var enemy = new Enemy(32, 32);
				enemy.image = game.assets['./Resources/Sprites/enemy.png'];
				enemy.x = Math.floor(Math.random() * Math.floor(640 - 32));
				enemy.y = -32;
				enemy.dx = 0;
				enemy.dy = 1;
				enemy.shotType = "EveryDirection";
				enemy.useAim = true;
				game.rootScene.addChild(enemy);
				enemyList.push(enemy);
			}
		});
	}

	game.start();
}
