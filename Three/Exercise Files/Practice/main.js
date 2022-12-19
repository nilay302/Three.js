function init() {
    //*creating new scene in THREE
	var scene = new THREE.Scene();
    var gui = new dat.GUI();

    //*using fog in the scene
    var enableFog = false;

    if(enableFog){
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    //*defining box and plane shape
    var boxGrid = getBoxGrid(10, 1.5);
    // var box = getBox(1,1,1);
    var plane = getPlane(30);
    // var spotLight = getSpotLight(1);
    var directionalLight = getDirectionalLight(1);
    var sphere = getSphere(0.05);

    //*used to get a clear geometric idea about the directional light(helper)
    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera)

    // var ambientLight = getAmbientLight(10);


    //giving name to the plane(can be used as a id)
    plane.name = 'plane-1';

    //moving the box up using the height property
	// box.position.y = box.geometry.parameters.height/2;

    //rotating thee plane in x axis
	plane.rotation.x = Math.PI/2;
    directionalLight.position.x = 13;
    directionalLight.position.y = 10;
    directionalLight.position.z = 10;
    directionalLight.intensity = 2;
	// plane.position.y = 1;

    gui.add(directionalLight,'intensity',0,10);
    gui.add(directionalLight.position,'x',0,20);
    gui.add(directionalLight.position,'y',0,20);
    gui.add(directionalLight.position,'z',0,20);
    // gui.add(spotLight,'penumbra',0,1);

    //adding box and plane to the scene
	// scene.add(box);
    scene.add(boxGrid);
	scene.add(plane);
    scene.add(directionalLight);
    directionalLight.add(sphere);
    // scene.add(helper);
    // scene.add(ambientLight);

    //creating camera(PerspectiveCamera)
	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

    //setting Camera's Position
    camera.position.x = 10;
    camera.position.y = 18;
    camera.position.z = -18;

    //making camera look at the centre
    camera.lookAt(new THREE.Vector3(0,0,0));

    //creating renderer
	var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');

    //adding renderer to id usinf DOM
	document.getElementById('webgl').appendChild(renderer.domElement);
    
    //to control the camera movement:
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    //calling update function
	update(renderer,scene, camera, controls);

    return scene;
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 1, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 1, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
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
function getSpotLight(intensity){
    var light = new THREE.SpotLight(0xffffff,intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}
function getDirectionalLight(intensity){
    var light = new THREE.DirectionalLight(0xffffff,intensity);
    light.castShadow = true;
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.top = 10;
    light.shadow.camera.right = 10;

    return light;
}
function getAmbientLight(intensity){
    var light = new THREE.AmbientLight('rgb(10,30,50)',intensity);
    //ambient light dont cast any shadow
    // light.castShadow = true;
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