import * as THREE from 'three';
import { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';


// ----- 주제: 기본 Geometry 파티클

export default function example() {

	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;
	camera.rotation.z = THREE.MathUtils.radToDeg(45);


	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	// const controls = new OrbitControls(camera, renderer.domElement);
	// controls.enableDamping = true;
	const controls = new FirstPersonControls( camera, renderer.domElement);
    controls.movementSpeed = 0.1;
	controls.activeLook = false;
	// controls.autoForward = true;
	// controls.lookSpeed = 0.0001;
	// 초당 z  + 1 이동하게된다.
	// const controls = new TrackballControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.SphereGeometry(2, 64, 64	);
	const backgeometry = new THREE.PlaneGeometry(20,20,50,50);
	// const geometry = new THREE.BoxGeometry(2,2,2);
	const material = new THREE.PointsMaterial({
		// wireframe:true,
		size:0.001,
		// sizeAttenuation:false,
		// color:"white"
        color:'white',
        
	});
	const backmaterial = new THREE.PointsMaterial({
		// wireframe:true,
		size:0.003,
		// sizeAttenuation:false,
		color:"white"
	});
    
	let points = [];
	let point;
	for (let i = 0; i < 100; i++){

		point = new THREE.Points(geometry, material);
        point.name = `${i}`;
		point.position.x = (Math.random()*8) - 4;
		point.position.y = (Math.random()*8) - 4;
		point.position.z = -(Math.random()*10) + 3;
		point.rotation.x = THREE.MathUtils.radToDeg((Math.random()*90)-45);
		scene.add(point);
		points.push(point);
	}

// 현재 카메라 - z 값 위치에 point 생성,  지나간 point 삭제 - point.position의 z값이 현재 카메라 z값 보다 작다면 삭제

	const backpoints = [];
	let backpoint;
	for (let i = 0; i < 10; i++){
		backpoint = new THREE.Points(backgeometry, backmaterial);
		backpoint.position.x = (Math.random()*50) - 25;
		backpoint.position.y = (Math.random()*50) - 25;
		backpoint.position.z = -(Math.random()*30) -8;
		backpoint.rotation.z = THREE.MathUtils.radToDeg((Math.random()*90)-45);
		scene.add(backpoint);
		backpoints.push(backpoint);
	}

	// const points = new THREE.Points(geometry, material);
	// scene.add(points);

	// 그리기
	const clock = new THREE.Clock();




	function draw() {
		const delta = clock.getDelta();
		// controls.update();

        // points.forEach((item)=>{
        //     if(item.position.z - camera.position.z > -5)delete points[item];  // points.splice(item,1);
        // });
        // console.log(points.length);
        // console.log(points);

        backpoints.forEach((item)=> {
            item.position.z -= delta;
            item.rotation.z += THREE.MathUtils.degToRad(0.1);
        });

		controls.update(delta);
		// console.log(camera.position.z);
        // console.log(delta);
		if(camera.position.z < -5){
			camera.position.z = (Math.random()*8)-5;
		}
        if(camera.position.z > 4) camera.position.z = 3;
        composer.render();
		// renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}
    const composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    const afterimagePass = new AfterimagePass();


    composer.addPass( afterimagePass );
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	const goSpace = () => {controls.autoForward = true;}
	const stopSpace = () => {controls.autoForward = false;}
    const Sup = () => {controls.movementSpeed += 0.1};
    const Sdown = () => { controls.movementSpeed -=0.1};
    const Score = () => {
        document.getElementById('score').innerHTML= Math.round(controls.movementSpeed*10)/10;
        console.log(controls.movementSpeed);

    };

	// 이벤트
	window.addEventListener('resize', setSize);
	let btn = document.getElementById('btn');
	let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');
    let btn4 = document.getElementById('btn4');
	btn.addEventListener('click' , goSpace);
	btn2.addEventListener('click' , stopSpace);
    btn3.addEventListener('click' , Sup);
    btn4.addEventListener('click' , Sdown);
    btn3.addEventListener('click', Score);
    btn4.addEventListener('click', Score);
	draw();
}
