var SceneCarga = {
    key: 'SceneCarga',
    active: false,
    preload: C_carga,
    create: C_inicio
    //extends: Phaser.Scene
};

function C_carga()
{
	let camera = this.cameras.main;
	
	let cajaCarga = this.add.image(camera.width/2,camera.height-100,'cajaCarga').setScale(1,0.7);
	let barraCarga = this.add.image(camera.width/2,camera.height-100,'barraCarga').setScale(1,0.7);
	let txt = this.add.text(cajaCarga.x,cajaCarga.y).setFontFamily('Arial').setFontSize(20).setColor('White').setOrigin(0.5,0);
	
	this.load.on('progress',(valor) => {
		let ancho = Math.round(barraCarga.width * valor);
		barraCarga.setCrop(0,0,ancho,cajaCarga.height);
		txt.setText(Math.round(valor * 100)+'%');
		
		if(valor === 1)
			txt.setText('Listo!');
	});
	
	this.load.image('fondo','./img/fondo.png');
	this.load.image('nubes','./img/cielo.png');
	this.load.image('titulo','./img/titulo2.png');
	this.load.image('btnReiniciar','./img/btnReiniciar.png');
	this.load.image('play','./img/play.png');
	this.load.image('bolaBlanca','./img/bolaBlanca.png');
	this.load.image('caja','./img/caja.png');
	this.load.image('caja3','./img/caja3.png');
	this.load.image('gameOver','./img/gameOver.png');
	this.load.image('tutorial','./img/tutorial.png');
	
	this.load.spritesheet('moneda','./img/moneda.png',{ frameWidth: 32, frameHeight: 32 });
	
	
	this.load.spritesheet('birds','./img/birds.png', { frameWidth: 200, frameHeight: 200 });

	
	// Cargar los Audios del Juego
	this.load.audio('coin', './audios/moneda.mp3');
	this.load.audio('choca', './audios/choca.mp3');
	this.load.audio('mover', './audios/mover.mp3');
	this.load.audio('play', './audios/play.mp3');
	this.load.audio('musica', './audios/musica.mp3');
}

function C_inicio()
{
	this.cameras.main.fadeOut(1000,0,0,0);
	
	this.cameras.main.once('camerafadeoutcomplete',() => {
		this.scene.start('main');
	});
}