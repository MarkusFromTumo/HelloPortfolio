let camera, scene, light, renderer, container;
let meshs = [];
let grounds = [];
let isMobile = false;
let antialias = true;
let graph;
let stats;

let geos = {};
let mats = {};
let spheres = [];
let updateIntervalHandler;

initShapes();
init();
loop();
startAnimation();
setupWorld();

function setupWorld() {
	drawAxes();
	for(let i = 0; i < 20; i++) addSphere({x:10,y:20,z:40, vx:Math.random(), vy:Math.random(), vz:Math.random()});
	// TODO

}

/*
 *	returns mesh of a sphere positioned at x,y,z
 *
 *  creating a new mesh: new THREE.Mesh( geometry, material );
 *  setting a position:  mesh.position.set(x, y, z);
 */
function addSphere(params) {
	// TODO
	params = typeof params === "object" ? params : {};
	let mesh = new THREE.Mesh(geos.sphere, mats.sphere);
	mesh.position.set(params.x || 0, params.y || 0, params.z || 0);
	scene.add(mesh);
	spheres.push({
		mesh:mesh,
		pos: mesh.position,
		v: {x:params.vx || 0, y:params.vy || 0, z: params.vz || 0},
		a: {x:params.ax || 0, y:params.ay || 0, z: params.az || 0}
	});
}

/*
* start calling the update function every 1000/60 milliseconds
*/
function startAnimation() {
	if (updateIntervalHandler) clearInterval(updateIntervalHandler);
	updateIntervalHandler = setInterval(updateScene, 1000 / 60);
}

/*
* change the positions according to the physics
*/
function updateScene() {
	let i, obj, newPosition;
	for (i = 0; i < spheres.length; ++i) {
		obj = spheres[i];
		newPosition = getPosition(obj);
		obj.mesh.position.set(newPosition.x, newPosition.y, newPosition.z)
		obj.pos = newPosition;
	}
}


/*
* returns the acceleration, based on 
* gravity and friction
*/
function getAcceleration(obj) {
	return { x: 0, y: 0, z: 0 }
}

function getVelocity(obj) {
	return { x: 0, y: 0, z: 0 };
}

function getPosition(obj) {
	obj.v.x = (obj.pos.x < 100 && obj.pos.x > -100) ? obj.v.x : -obj.v.x;
	obj.v.y = (obj.pos.y < 100 && obj.pos.y > -100) ? obj.v.y : -obj.v.y;
	obj.v.z = (obj.pos.z < 100 && obj.pos.z > -100) ? obj.v.z : -obj.v.z;
	return {
		x:obj.pos.x + obj.v.x || 0,
		y:obj.pos.y + obj.v.y || 0,
		z:obj.pos.z + obj.v.z || 0	
	};
}