import * as THREE from 'three';
import { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';


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
	// camera.rotation.x = THREE.MathUtils.degToRad(45);
	// camera.rotation.y = THREE.MathUtils.degToRad(45);
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
	// controls.activeLook = false;
	// controls.autoForward = true;
	controls.lookSpeed = 0.0001;
	
	// const controls = new TrackballControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.SphereGeometry(2, 64, 64	);
	const backgeometry = new THREE.PlaneGeometry(3,3,50,50);
	// const geometry = new THREE.BoxGeometry(2,2,2);
	const material = new THREE.PointsMaterial({
		// wireframe:true,
		size:0.001,
		// sizeAttenuation:false,
		color:"white"
	});
	const backmaterial = new THREE.PointsMaterial({
		// wireframe:true,
		size:0.003,
		// sizeAttenuation:false,
		color:"white"
	});

// 현재 카메라 - z 값 위치에 point 생성,  지나간 point 삭제 - point.position의 z값이 현재 카메라 z값 보다 작다면 삭제

	const points = [];
	let point;
	for (let i = 0; i < 100; i++){
		point = new THREE.Points(geometry, material);
		point.position.x = (Math.random()*5) - 2.5;
		point.position.y = (Math.random()*5) - 2.5;
		point.position.z = -(Math.random()*10) + 3;
		point.rotation.x = THREE.MathUtils.radToDeg((Math.random()*90)-45);
		scene.add(point);
		points.push(point);
	}

	const backpoints = [];
	let backpoint;
	for (let i = 0; i < 30; i++){
		backpoint = new THREE.Points(backgeometry, backmaterial);
		backpoint.position.x = (Math.random()*8) - 4;
		backpoint.position.y = (Math.random()*8) - 4;
		backpoint.position.z = -(Math.random()*20) -8;
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

		controls.update(delta);
		// console.log(camera.position);
		if(camera.position.z < -5){
			camera.position.z = 3;
		}
		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	const goSpace = () => {controls.autoForward = true;}
	const stopSpace = () => {controls.autoForward = false;}

	// 이벤트
	window.addEventListener('resize', setSize);
	let btn = document.getElementById('btn');
	let btn2 = document.getElementById('btn2');
	btn.addEventListener('click' , goSpace);
	btn2.addEventListener('click' , stopSpace);
	draw();
}
