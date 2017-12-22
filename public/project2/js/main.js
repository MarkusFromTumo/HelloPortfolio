let camera, scene, light, renderer, container;
let meshs = [];
let grounds = [];
let isMobile = false;
let antialias = true;
let graph;
let stats;
let iterationNumber = 0;
let trailCount = 0;
let gravityConst = 0.5
let geos = {};
let mats = {};
let spheres = [];
let updateIntervalHandler;

loadAssets(main);
function main(){
	initShapes();
	init();
	loop();
	startAnimation();
	setupWorld();	
}

function setupWorld() {
	// drawAxes();
	
	// addSphere({x:0, y: 100, vx: 0, vy: 0, ay:0, vx: 1})

	loadPlanets()
}


function loadPlanets(){
	// use letiable planets from planets.js
	// to turn degrees to radian: alpha * Math.PI / 180
//------------------- BEGIN YOUR CODE

	for(let key in planets)
		addSphere({
			x: planets[key].distance , 
			y: Math.tan(Math.PI / 180 * planets[key].tilt) * planets[key].distance, 
			vy: 0, 
			ay:0, 
			vz: planets[key].velocity, 
			name: key
		})

//------------------- END YOUR CODE
	scene.add(spotlight);
	scene.remove(light);
	scene.remove(ambientLight);
	scene.remove(background);
}

/*
 *	returns mesh of a sphere positioned at x,y,z
 *
 *  creating a new mesh: new THREE.Mesh( geometry, material );
 *  setting a position:  mesh.position.set(x, y, z);
 */
function addSphere(params)
{
	// TODO
	// scene has a function .add(mesh)
	// geometry ---> geos.sphere
	// material ---> mats.sphere

	params = params || {};
	params.x = params.x || 0;
	params.y = params.y || 0;
	params.z = params.z || 0;
	params.vx = params.vx || 0;
	params.vy = params.vy || 0;
	params.vz = params.vz || 0;
	params.ax = params.ax || 0;
	params.ay = params.ay || 0;
	params.az = params.az || 0;
	params.name = params.name || "sphere";

	let meshTmp = new THREE.Mesh(geos[params.name], mats[params.name]);
	meshTmp.position.set(params.x, params.y, params.z)
	scene.add(meshTmp)

	let obj = {
		mesh : meshTmp,
		pos : {x : params.x, y : params.y, z : params.z},
		v : {x : params.vx, y : params.vy, z : params.vz},
		a : {x : params.ax, y : params.ay, z : params.az}
	}

	if(params.name != "sun") spheres.push(obj);
}

/*
* start calling the update function every 1000/60 milliseconds
*/
function startAnimation(){
	if(updateIntervalHandler) clearInterval(updateIntervalHandler);
	updateIntervalHandler =	setInterval(updateScene, 1000/60);
}

/*
* change the positions according to the physics
*/
function updateScene(){
	let i, obj, newPosition;
	iterationNumber = (iterationNumber + 1) % 100000;
	for(i = 0; i < spheres.length; ++i){
		obj = spheres[i];
		newPosition = getPosition(obj);
		if (iterationNumber % 30 == 0 && trailCount < 2000) addTrail(obj.pos);
		obj.mesh.position.set(newPosition.x, newPosition.y, newPosition.z)
		obj.pos = newPosition;
	}
}

function addTrail(pos){
	let meshTmp = new THREE.Mesh(geos.trail, mats.trail);
	meshTmp.position.set(pos.x, pos.y, pos.z)
	scene.add(meshTmp)
	trailCount++;
}


/*
* returns the acceleration, based on 
* gravity
*/
function getAcceleration(obj) {
	// simulate the gravity force between the object and the origin(sun)
	// dont forget to multiply by the gravityConst
// //------------------- BEGIN YOUR CODE

	with(obj.pos) {

		var r = Math.sqrt(x**2+y**2+z**2);

		return {	
			x: - gravityConst * x / r**2,
			y: - gravityConst * y / r**2,
			z: - gravityConst * z / r**2,
		}
	}

//------------------- END YOUR CODE	
}

function getVelocity(obj) {
//------------------- BEGIN YOUR CODE

	a = getAcceleration(obj);
	obj.a = a;

	let newX = obj.v.x + a.x;
	let newY = obj.v.y + a.y;	
	let newZ = obj.v.z + a.z;	
	// console.log({x : newX, y : newY, z : newZ});
	return {x : newX, y : newY, z : newZ}

//------------------- END YOUR CODE	

}

function getPosition(obj) {
	v = getVelocity(obj);
	obj.v = v;

	let newX = obj.pos.x + v.x;
	let newY = obj.pos.y + v.y;	
	let newZ = obj.pos.z + v.z;	
	
	return {x : newX, y : newY, z : newZ}
}

