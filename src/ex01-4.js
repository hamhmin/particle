import * as THREE from 'three';
import { Mesh } from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// ----- 주제: 기본 Geometry 파티클

export default function example() {
	let btn = document.getElementById('btn');
	let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');
    let btn4 = document.getElementById('btn4');
    let btn5 = document.getElementById('btn5');
    let btn6 = document.getElementById('btn6');
	// mouse
	const mouse = new THREE.Vector2();
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
	const controls = new FirstPersonControls( camera, renderer.domElement);
    controls.movementSpeed = 0.1;
	controls.activeLook = false;
	// controls.autoForward = true;
	// controls.lookSpeed = 0.0001;
	// 초당 z  + 1 이동하게된다.

	// Mesh
	const geometry = new THREE.SphereGeometry(2, 64, 64	);

	let points = [];
	let point;
	for (let i = 0; i < 20; i++){
        const material = new THREE.PointsMaterial({
            size:0.005,
            // sizeAttenuation:false,
            // color:"red"
            color: `rgb(
                ${50 + Math.floor(Math.random()*205)},
                ${50 + Math.floor(Math.random()*205)},
                ${50 + Math.floor(Math.random()*205)}
            )`
        });
		point = new THREE.Points(geometry, material);
        point.name = `${i}`;
		point.position.x = (Math.random()*8) - 4;
		point.position.y = (Math.random()*8) - 4;
		point.position.z = -(Math.random()*12) + 5;
		point.rotation.x = THREE.MathUtils.radToDeg((Math.random()*90)-45);
		scene.add(point);
		points.push(point);
	}
// 현재 카메라 - z 값 위치에 point 생성,  지나간 point 삭제 - point.position의 z값이 현재 카메라 z값 보다 작다면 삭제

	// points 배열의 구 색상 및 위치 재배치 함수
	function points_item () {
		points.forEach((item)=>{
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 0;
			// console.log(item.position);
			item.position.set(
				(Math.random()*8) - 4,
				(Math.random()*8) - 4,
				-(Math.random()*10) + 3
			);
			item.material.color.set(
				`rgb(
					${50 + Math.floor(Math.random()*205)},
					${50 + Math.floor(Math.random()*205)},
					${50 + Math.floor(Math.random()*205)}
				)`
			)
		});
	}
	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
		const time = clock.getElapsedTime();
		// controls.update();
		// controls.movementSpeed -= Math.sin(time * 0.0001)*100;
		controls.update(delta);
		// console.log(camera.position.z);
        // console.log(delta);
		if(camera.position.z < -5){
			camera.position.z = 0;//(Math.random()*8)-5;
			points_item();
		}
        if(camera.position.z > 4) {
			camera.position.z = 0.5;
			points_item();
		}
		if(camera.position.x < -3) {
			camera.position.x = 0;
			points_item();
		}
		if(camera.position.x > 3) {
			camera.position.x = 0;
			points_item();
		}
		if(camera.position.y < -3) {
			camera.position.y = 0;
			points_item();
		}
		if(camera.position.y > 3) {
			camera.position.y = 0;
			points_item();
		}
        composer.render();
		// renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);


		// mouse 이동에 따른 카메라 lookAt 보정
		// console.log("커서 위치에 따른 xyz 좌표" , mouse)
		console.log(camera.position,mouse.x,mouse.y);
		camera.lookAt(mouse.x,mouse.y);
	}

	scene.fog = new THREE.Fog("#fff", 0, 1);
	
    const composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    const afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );

	// HalftonePass   반 명암? 블렌드 적용된듯한 느낌
	const halftonePass = new HalftonePass();

	// bloom 설정
	const params = {
		exposure: 1,
		bloomStrength: 1.5,
		bloomThreshold: 0,
		bloomRadius: 0
	};
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	const goSpace = () => {controls.autoForward = true;}
	const stopSpace = () => {controls.autoForward = false;}
    const Sup = () => {controls.movementSpeed += 0.3};
    const Sdown = () => { controls.movementSpeed -=0.3};
    const Score = () => {
        document.getElementById('score').innerHTML= Math.round(controls.movementSpeed*10)/10;
        console.log(controls.movementSpeed);
    };
	const halftone =  () => { composer.addPass( halftonePass ); }
	const offHalftone = () => { composer.removePass( halftonePass ); }
	const iftone = () => {
		if(btn5.classList.contains("off")){
			btn5.classList.replace("off","on");
			halftone();
		} else if(btn5.classList.contains("on")){
			btn5.classList.replace("on","off");
			offHalftone();
		}
	}
	const  onBloom =  () => { composer.addPass( bloomPass ); }
	const offBloom = () => { composer.removePass( bloomPass ); }
	const ifbloom = () => {
		if(btn6.classList.contains("off")){
			btn6.classList.replace("off","on");
			onBloom();
		} else if(btn6.classList.contains("on")){
			btn6.classList.replace("on","off");
			offBloom();
		}
	}

	// 이벤트
	window.addEventListener('resize', setSize);
	btn.addEventListener('click' , goSpace);
	btn2.addEventListener('click' , stopSpace);
    btn3.addEventListener('click' , Sup);
    btn4.addEventListener('click' , Sdown);
    btn3.addEventListener('click', Score);
    btn4.addEventListener('click', Score);
	btn5.addEventListener('click', iftone);
	btn6.addEventListener('click', ifbloom);
	// mouse 이동에 따른 카메라 lookAt 보정
	canvas.addEventListener('mousemove',e=>{
		mouse.x = e.clientX / canvas.clientWidth * 2 -1;
		mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
	})
	draw();
}
