var main = {
	key: 'main',
	active: false,
	create: inicio,
	update: actualiza
	//extends: Phaser.Scene
};

var estaScena;
var fondo;
var nubes;
var titulo;
var btnPlay;
var bird;
var posYBird;
var animBalanso;
var animBirdBalanso;
var rotaDer;
var rotaIzq;
var empezoJuego;
var velBird;
var gameOver;
var CAJAS;
var elegirCaja;
var MONEDAS;
var textoMonedas;
var textoCajas;
var puntosMonedas;
var puntosCajas;
var audioCoin;
var audioChoca;
var audioMover;
var audioPlay;
var audioMusica;
var datosGuardadosBird;
var posYBird;
var pantFinal;
var gameOverImg;
var tutorial;
var ladoIzq;
var ladoDer;

function inicio() {
	//localStorage.removeItem('datosGuardadosBird');

	datosGuardadosBird = localStorage.getItem('datosGuardadosBird');

	if (datosGuardadosBird === null) {
		datosGuardadosBird =
		{
			puntos: 0,
			monedas: 0
		}
	} else
		datosGuardadosBird = JSON.parse(datosGuardadosBird);

	gameOver = false;
	pantFinal = false;
	estaScena = this;
	rotaDer = false;
	rotaIzq = false;
	ladoDer = false;
	ladoIzq = false;
	empezoJuego = false;
	velBird = 3;
	puntosCajas = 0;
	puntosMonedas = datosGuardadosBird.monedas;
	CAJAS = [];
	MONEDAS = [];
	elegirCaja = false;
	camera = this.cameras.main;

	this.input.addPointer(2);

	camera.fadeIn(500, 0, 0, 0);

	//Crear los Audios del juego
	audioCoin = this.sound.add('coin');
	audioChoca = this.sound.add('choca');
	audioMover = this.sound.add('mover');
	audioPlay = this.sound.add('play');
	audioMusica = this.sound.add('musica')
	audioMusica.setLoop(true)
	audioMusica.setVolume(0.2)
	
	
	// Creando el fondo del juego...
	fondo = this.add.image(camera.width/2, camera.height/2, 'fondo').setOrigin(0.5).setDisplaySize(camera.width, camera.height);
	nubes = this.add.tileSprite(0, 0, camera.width, camera.height+10, 'nubes').setOrigin(0);

	titulo = this.add.image(camera.width/2, camera.height/2, 'titulo').setDisplaySize(camera.width/1.1, camera.width/3).setTint(0xfd961f);

	// Creando a Bird...
	posYBird = camera.height/4.3;
	bird = this.physics.add.sprite(camera.width/2, posYBird, 'birds').setDisplaySize(camera.width/5, camera.width/5.3);
	let tb = bird.displayWidth;
	bird.setBodySize(tb*1.5, tb*1.3)
	bird.setDepth(50);
	animBalanso = this.tweens.add({
		targets: bird,
		duration: 1500,
		y: posYBird-30,
		yoyo: true,
		repeat: -1,
		ease: 'Sine.easeInOut'
	});

	this.anims.create({
		key: 'volar',
		frames: this.anims.generateFrameNumbers('birds', {
			start: 0, end: 1
		}),
		frameRate: 5,
		repeat: -1
	});

	bird.anims.play('volar', true);
	
	this.input.on('pointerdown', (p) => {
		if(p.x >= camera.width/2)
			funBtnDer();
		else
			funBtnIzq();
	});
	
	this.input.on('pointerup', () => {
		rotaDer = false;
		rotaIzq = false;
		bird.setAngle(0)
		
		if (ladoIzq && ladoDer && tutorial.visible) {
			tutorial.setVisible(false);
		}
	});

	btnPlay = this.add.image(camera.width/2,
		camera.height/1.3,
		'play').setDisplaySize(camera.width/2.5,
		camera.width/2.5).setInteractive();
	btnPlay.on('pointerdown',
		() => {
			audioPlay.play();
			camera.fadeOut(500, 0, 0, 0);

			camera.once('camerafadeoutcomplete', () => {
				if (!gameOver)
					iniciarJuego();
				else
					this.scene.start('main');
				
			});
		});

	crearCajas();

	// Colission entre bird y las cajas...
	for (let i = 0; i < CAJAS.length; i++) {
		this.physics.add.overlap(bird, CAJAS[i], colisionBirdCajas, null, this);
	}

	//Crear 10 monedas

	this.anims.create({
		key: 'girar',
		frames: this.anims.generateFrameNumbers('moneda', {
			start: 0, end: 5
		}),
		frameRate: 20,
		repeat: -1
	});

	for (let i = 0; i < 10; i++) {
		let moneda = this.physics.add.sprite(0, 0, 'moneda').setDisplaySize(camera.width/10, camera.width/10);
		moneda.setPosition(Phaser.Math.Between(0 + moneda.displayWidth/2, camera.width-moneda.displayWidth), Phaser.Math.Between(-100, -2200));
		moneda.setCircle(camera.width/25);
		moneda.vel = Phaser.Math.Between(2, 5)
		//Cambiando el frameRate de la animacion...
		moneda.play({
			key: 'girar',
			frameRate: Phaser.Math.Between(15, 30)
		});

		moneda.anims.play('girar', true);

		MONEDAS.push(moneda);
	}

	// Colision entre bird y kas monedas...
	for (let i = 0; i < MONEDAS.length; i++) {
		this.physics.add.overlap(bird, MONEDAS[i], colisionBirdMonedas, null, this);
	}

	//Crear textos de puntuacion
	let tt = camera.width/15;
	textoCajas = this.add.text(10, 20, 'Puntos Max: '+datosGuardadosBird.puntos).setFontFamily('Arial').setFontSize(tt).setColor('black').setOrigin(0).setFontStyle('bold italic').setFontFamily('Open Sans');
	textoMonedas = this.add.text(10, 50, 'Monedas: '+datosGuardadosBird.monedas).setFontFamily('Arial').setFontSize(tt).setColor('black').setOrigin(0).setFontStyle('bold italic').setFontFamily('Open Sans');

	gameOverImg = this.add.image(camera.width/2, camera.height/4, 'gameOver').setDisplaySize(camera.width/2, camera.width/2).setVisible(false);

	tutorial = this.add.image(0,0,'tutorial')
	.setOrigin(0)
	.setDisplaySize(camera.width,camera.height)
	.setTint(0xE45A00)
	.setVisible(false)
}

function actualiza() {
	
	//Limitar bird.x dentro de pantalla...
	if(tutorial.visible)
		bird.x = Phaser.Math.Clamp(bird.x,bird.displayWidth/2,camera.width-bird.displayWidth/2 );

	nubes.tilePositionY -= 0.5;

	// mover bird hacia los lados
	if (empezoJuego || gameOver)
		moverBird();
	
	if(tutorial.visible)
		return;
		
	moverMonedas();

	controlJuego();

}

function iniciarJuego() {
	audioMusica.play();
	textoCajas.setText('Puntos: '+ 0);
	camera.fadeIn(500, 0, 0, 0);
	animBalanso.stop();
	tutorial.setVisible(true);
	bird.y = camera.height/1.3;
	animBirdBalanso = estaScena.tweens.add({
		targets: bird,
		duration: 800,
		y: camera.height/1.3-20,
		yoyo: true,
		repeat: -1,
		ease: 'Sine.easeInOut'
	});
	particulas();
	titulo.setActive(false).setVisible(false);
	btnPlay.removeInteractive().setVisible(false);
	empezoJuego = true;
	cajaActiva = false;
}

function moverBird() {
	if (rotaDer) {
		bird.x += velBird;
		bird.setFrame(4)
		bird.setAngle(15)
	}

	if (rotaIzq) {
		bird.x -= velBird;
		bird.setFrame(3)
		bird.setAngle(-15)
	}
}

function funBtnDer()
{
	if(!empezoJuego || gameOver)
		return;
		
	rotaDer = true;
	audioMover.play();
	
	if(tutorial.visible && !ladoDer)
		ladoDer = true;
}

function funBtnIzq(e)
{
	if(!empezoJuego || gameOver)
	return;
	
	rotaIzq = true;
	audioMover.play();
	
	if(tutorial.visible && !ladoIzq)
		ladoIzq = true;
}


function moverMonedas() {
	if (empezoJuego && !pantFinal) {
		for (a of MONEDAS) {
			a.y += a.vel;

			if (a.y >= camera.height+a.displayHeight)
				a.setPosition(Phaser.Math.Between(0 + a.displayWidth/2, camera.width-a.displayWidth), Phaser.Math.Between(-100, -2200));
		}
	}
}

function particulas() {
	partBird = estaScena.add.particles('bolaBlanca')
	.createEmitter({
		x: bird.x,
		y: bird.y,
		//gravityY: 300,
		speedY: 200,
		lifespan: 3000, // {min:1000,max:2500},
		quantity: 1,
		frequency: 300,
		scale: 0.2, // { start: 1, end: 0 },
		tint: [0xffcc33], //0xff0000, 0x00ff00,0x0000ff, 0xf0f0f0,0x0f0f0f],
		alpha: 0.7, //{ start: 1, end: 0 },
		follow: bird,
		blendMode: 4// 'ADD',
		//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
	});
}

function particulasFin() {
	var emitter1 = estaScena.add.particles('bolaBlanca').createEmitter({
		x: 200,
		y: 200,
		speed: {
			random: [400, 1000]}, //{start: 800,end: 0},
		scale: {
			random: [0.2, 1]},
		blendMode: 4,
		alpha: {
			start: 1, end: 0
		},
		tint: [0xef232e],
		quantity: 20,
		bounce: 0.3,
		bounds: {
			x: 0, y: 0, width: camera.width, height: camera.height
		},
		//active: false,
		lifespan: {
			random: [1000, 1500]},
		follow: bird
	});
	emitter1.explode();
}

function particulasMonedas(x, y) {
	var emitter1 = estaScena.add.particles('bolaBlanca').createEmitter({
		x: x,
		y: y,
		speed: {
			random: [200, 100]}, //{start: 800,end: 0},
		scale: {
			random: [0.1, 0.7]},
		blendMode: 4,
		alpha: {
			start: 1, end: 0
		},
		tint: [0xE09A00], //0xffcc33,0xe32fe7,0x90de14,0x1f90e33,0xFD961F,0xD3E901,0x0ff146],
		quantity: 40,
		lifespan: {
			random: [100, 500]}
	});
	emitter1.explode();
}

function controlJuego() {
	if (bird.visible && bird.x < bird.displayWidth/2.5 || bird.visible && bird.x > camera.width - bird.displayWidth/2.5)
		colisionBirdCajas();

	// Elegir una caja...
	if (!elegirCaja && empezoJuego && !pantFinal) {
		let c = Phaser.Math.Between(0, CAJAS.length-1)

		for (let a = 0; a < CAJAS.length; a++) {
			if (c !== a)
				continue;

			if (CAJAS[a].visible)
				break;
			else
			{
				CAJAS[c].setActive(true);
				CAJAS[c].setVisible(true);
				CAJAS[c].velCaja = Phaser.Math.Between(3, 6);
				CAJAS[c].x = Phaser.Math.Between(CAJAS[c].displayWidth/2, camera.width-CAJAS[c].displayWidth);
				CAJAS[c].y = -100;
				CAJAS[c].pasoBird = false;
				elegirCaja = true;
				break;
			}
		}
	}

	// Mover caja elegida hacia abajo...
	for (let w = 0; w < CAJAS.length; w++) {
		if (CAJAS[w].visible) {
			CAJAS[w].y += CAJAS[w].velCaja;

			// Revisar posicion y para llamar otra caja
			if (CAJAS[w].y >= bird.y - bird.displayHeight && !CAJAS[w].pasoBird) {
				CAJAS[w].pasoBird = true;
				elegirCaja = false;
			}

			//controlar si salio de pantalla desactivar esta caja
			if (CAJAS[w].y >= camera.height + bird.displayHeight && CAJAS[w].pasoBird) {
				CAJAS[w].setActive(false);
				CAJAS[w].setVisible(false);

				if (!gameOver) {
					puntosCajas++;
					textoCajas.setText('Puntos: '+ puntosCajas);
				}
			}
		}
	}
}

function crearCajas() {
	let w = bird.displayWidth/1.5;

	for (let i = 0; i < 6; i++) {
		let caja;

		if (i % 2)
			caja = estaScena.physics.add.image(100, -200, 'caja').setDisplaySize(w, w);
		else
			caja = estaScena.physics.add.image(100, -200, 'caja3').setDisplaySize(w*3, w);

		caja.velCaja = 1;
		caja.pasoBird = false;
		caja.setActive(false);
		caja.setVisible(false);
		CAJAS.push(caja);
	}
}

function colisionBirdCajas() {
	audioChoca.play();
	
	audioMusica.setLoop(false);
	audioMusica.stop();
		
	for (a of CAJAS) {
		a.setVisible(false);
		a.setActive(false);
	}

	for (x of MONEDAS) {
		x.setVisible(false);
		x.setActive(false);
	}


	pantFinal = true;
	animBirdBalanso.stop();
	bird.body.enable = false;
	partBird.stop()
	gameOver = true;
	bird.setVisible(false);
	bird.setActive(false);
	particulasFin();

	if (puntosCajas > datosGuardadosBird.puntos) {
		datosGuardadosBird.monedas = puntosMonedas;
		datosGuardadosBird.puntos = puntosCajas;
		localStorage.setItem('datosGuardadosBird', JSON.stringify(datosGuardadosBird));
	}

	estaScena.cameras.main.shake(300);
	estaScena.cameras.main.once('camerashakecomplete', () => {
		estaScena.cameras.main.fadeOut(1000, 0, 0, 0);
	});

	estaScena.cameras.main.once('camerafadeoutcomplete', () => {
		pantallaFinal(); //estaScena.scene.start('main');
	});
}

function colisionBirdMonedas(bird, moneda) {
	audioCoin.play();
	particulasMonedas(moneda.x, moneda.y);
	moneda.setPosition(Phaser.Math.Between(0 + moneda.displayWidth/2, camera.width-moneda.displayWidth), Phaser.Math.Between(-100, -2200));
	puntosMonedas++;
	textoMonedas.setText('Monedas: '+puntosMonedas);
}

function pantallaFinal() {
	camera.fadeIn(500, 0, 0, 0);
	btnPlay.setInteractive().setVisible(true).setTexture('btnReiniciar').setDisplaySize(camera.width/2.5, camera.width/2.5);
	textoCajas.setPosition(camera.width/2, camera.height/2).setOrigin(0.5);
	textoCajas.setText('Puntos: '+ puntosCajas+'\nPUNTOS MAX: '+datosGuardadosBird.puntos);
	gameOverImg.setVisible(true);
	bird.setPosition(camera.width/2, posYBird);
}

function controlTatil()
{
	estaScena.input.on('pointermove', function (pointer) {
		if (pointer.x < bird.x-bird.displayWidth/2)
		{
			rotaIzq = true;
			rotaDer = false;
		}else if (pointer.x > bird.x+bird.displayWidth/2)
		{
			rotaDer = true;
			rotaIzq = false
		}
		else {
			rotaDer = false;
			rotaIzq = false;
			bird.setAngle(0)
		}
		
		estaScena.physics.moveToObject(bird, pointer, 50);
	},
		estaScena);
}