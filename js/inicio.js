config = {
	type: Phaser.AUTO,
	width: 400,
	height: 850,
	parent: 'parentela',
	dom: {
		createContainer: true
	},
	scale:{
		mode: Phaser.Scale.FIT,
		autoCenter: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene:[Entrada,SceneCarga,main] 
};

var juego = new Phaser.Game(config);

function verPropiedadesFull(obj)
{
	var w =''		
	for (var i in obj){
		 w += console.log(i, obj[i])
		 w += '\n' 
	 }
	 return console.log(w);
} 

function listObj(object) 
{
	var jList = '', cList = 0;
	   
	for(var key in object) 
	{
	     jList +=key;
	     jList += '\n';
	     cList++;
	}
	
	return console.log(jList+ 'total: '+ cList );
}
	
function lerp (start, end, amt)
{
  return (1-amt)*start+amt*end
}

function cambiarDepthContainer(array,obj1,obj2)
{
	if(!array.includes(obj1) || !array.includes(obj2))
		return;
		
	let obj1_pos = array.indexOf(obj1);
	let obj2_pos = array.indexOf(obj2);
	
	array.splice(obj1_pos,1,obj2);
	array.splice(obj2_pos,1,obj1);
}