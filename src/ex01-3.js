import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { CubeTexturePass } from 'three/examples/jsm/postprocessing/CubeTexturePass';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass';
import { MaskPass } from 'three/examples/jsm/postprocessing/MaskPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GUI } from 'dat.gui';
// ----- 주제: effectcomposer

export default function example() {


	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    //composer
    const composer = new EffectComposer(renderer);
	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	


	
	// Mesh
	const geometry = new THREE.SphereGeometry(1, 32, 32	);
	// const geometry = new THREE.BoxGeometry(2,2,2);

	const points = [];
    let point;
    for(let i = 0; i < 50; i++){
        const material = new THREE.PointsMaterial({
            size:0.02,
            // sizeAttenuation:false,
            // color:"red"
            color: `rgb(
                ${50 + Math.floor(Math.random()*205)},
                ${50 + Math.floor(Math.random()*205)},
                ${50 + Math.floor(Math.random()*205)}
            )`
    
        });
    point = new THREE.Points(geometry, material);
    point.position.x = (Math.random() * 5) -2.5; 
    point.position.y = (Math.random() * 5) -2.5; 
    point.position.z = (Math.random() * 5) -2.5; 
	scene.add(point);
    points.push(point);
    }


    




	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();
        composer.render();
		// renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    // 이게 있어야  pass 적용 가능한듯    
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    
    // glitchPass 글리치효과 (지직거림)
    // const glitchPass = new GlitchPass();
    // composer.addPass( glitchPass );

    // filmPass grayscale? 필름화?
    // const filmPass = new FilmPass();
    // composer.addPass( filmPass );
    
    // cubeTexturePass  projectionMatrix관련 오류 나옴 추가 설정 필요한듯
    // const cubeTexturePass = new CubeTexturePass();
    // composer.addPass( cubeTexturePass );
    
    // adaptiveToneMappingPass 변화 없음  환해보이는것같기도?
    // const adaptiveToneMappingPass = new AdaptiveToneMappingPass();
    // composer.addPass( adaptiveToneMappingPass );

    // AfterimagePass   잔상효과
    const afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );

    // BloomPass   모르겠음 오류코드는 안뜨는데 화면 구현이 안됨. 추가 설정 필요한듯함    https://threejs.org/examples/#webgl_postprocessing_unreal_bloom
    // const bloomPass = new BloomPass();
    // composer.addPass( bloomPass );


    // BokehPass   모름
    // const bokehPass = new BokehPass();
    // composer.addPass( bokehPass );



    // ClearPass  모름
    // const clearPass = new ClearPass();
    // composer.addPass( clearPass );


    // DotScreenPass   dot 효과
    // const dotScreenPass = new DotScreenPass();
    // composer.addPass( dotScreenPass );


    // HalftonePass   반 명암? 블렌드 적용된듯한 느낌
    const halftonePass = new HalftonePass();
    composer.addPass( halftonePass );


    // LUTPass   모름
    // const lUTPass = new LUTPass();
    // composer.addPass( lUTPass );


    // MaskPass   모름 오류 matrixWorldAutoUpdate
    // const maskPass = new MaskPass();
    // composer.addPass( maskPass );


    // OutlinePass   모름 오류 isperspectivecamera
    // const outlinePass = new OutlinePass();
    // composer.addPass( outlinePass );


    // Pass   모름 오류남
    // const pass = new Pass();
    // composer.addPass( pass );


    // SAOPass   모름 오류 isperspectivecamera
    // const sAOPass = new SAOPass();
    // composer.addPass( sAOPass );


    // SMAAPass  실행은 되나 추가 설정이 필요한듯  https://stackoverflow.com/questions/43413685/three-js-combining-smaa-and-ssao-postprocessing
    // const sMAAPass = new SMAAPass();
    // composer.addPass( sMAAPass );


    // SSAARenderPass   모름 오류남
    // const sSAARenderPass = new SSAARenderPass();
    // composer.addPass( sSAARenderPass );


    // SSAOPass   모름 오류남
    // const sSAOPass = new SSAOPass();
    // composer.addPass( sSAOPass );


    // SSRPass   모름 오류남
    // const sSRPass = new SSRPass();
    // composer.addPass( sSRPass );


    // SavePass   모름 안보임
    // const savePass = new SavePass();
    // composer.addPass( savePass );


    // ShaderPass   모름
    // const shaderPass = new ShaderPass();
    // composer.addPass( shaderPass );
    
    // TAARenderPass   모름 오류
    // const tAARenderPass = new TAARenderPass();
    // composer.addPass( tAARenderPass );

    // TexturePass   모름 오류남
    // const texturePass = new TexturePass();
    // composer.addPass( texturePass );
    
    // UnrealBloomPass   반짝임 
    // const UnrealBloomPass = new UnrealBloomPass();
    // composer.addPass( UnrealBloomPass );

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

    // composer = new EffectComposer( renderer );
    // composer.addPass( renderScene );
    composer.addPass( bloomPass );



    
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}
    // gui
    const gui = new GUI();

    gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        renderer.toneMappingExposure = Math.pow( value, 4.0 );

    } );

    gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

        bloomPass.threshold = Number( value );

    } );

    gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

        bloomPass.strength = Number( value );

    } );

    gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

        bloomPass.radius = Number( value );

    } );
	// 이벤트
	window.addEventListener('resize', setSize);

	draw();

    
}
