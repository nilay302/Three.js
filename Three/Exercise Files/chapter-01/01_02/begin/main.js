function init() {
    //creating new scene in THREE
	var scene = new THREE.Scene();
    var gui = new dat.GUI();
    //using fog in the scene
    var enableFog = false;
    if(enableFog){
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    //defining box and plane shape
    var box = getBox(1,1,1);
    var plane = getPlane(20);
    var pointLight = getPointLight(1);
    var sphere = getSphere(0.05);
    //giving name to the plane(can be used as a id)
    plane.name = 'plane-1';

    //moving the box up using the height property
	box.position.y = box.geometry.parameters.height/2;

    //rotating thee plane in x axis
	plane.rotation.x = Math.PI/2;
    pointLight.position.y = 2;
    //code commented below:
	// plane.position.y = 1;

    gui.add(pointLight,'intensity',0,10);
    gui.add(pointLight.position,'y',0,5);

    //adding box and plane to the scene
	scene.add(box);
	scene.add(plane);
    scene.add(pointLight);
    pointLight.add(sphere);

    //creating camera(PerspectiveCamera)
	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

    //setting Camera's Position
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    //making camera look at the centre
    camera.lookAt(new THREE.Vector3(0,0,0));

    //creating renderer
	var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');

    //adding renderer to id usinf DOM
	document.getElementById('webgl').appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //calling update function
	update(renderer,scene, camera, controls);

    return scene;
}


function getBox(w,h,d){
    var geometry = new THREE.BoxGeometry(w,h,d);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow = true;
    return mesh;
}
function getSphere(size){
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,255)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    )
    return mesh;
}
function getPlane(size){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side:THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff,intensity);
    light.castShadow = true;
    return light;
}

function update(renderer,scene,camera, controls){
    //rendering the scene
    renderer.render(
		scene,
		camera,
	);
        controls.update();
    //adding animation to a particular part of scene by name
    // var plane = scene.getObjectByName('plane-1');
	// plane.rotation.y += 0.001;
	// plane.rotation.z += 0.001;

    //traverse through all the childs and performs this action
    // scene.traverse(function(child) {
	// 	child.scale.x += 0.00001;
	// })
    
    //continuous animation
    requestAnimationFrame(function(){
        update(renderer,scene,camera, controls);
    })
}

var scene = init();