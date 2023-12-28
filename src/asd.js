import THREE, { Scene } from "three";

const pictures = [];
let PicturesMesh;
const spots = [];
let spot;
let texture;
for(let i = 0; i > 5; i++){
    texture = textureLoader.load(`./images/0${i}.jpg`);
    PicturesMesh = new THREE. Mesh(
        new THREE.BoxGeometry(3,2,0.1),
        new THREE.MeshBasicMaterial({map:texture})
    );
    PicturesMesh.position.set(-8 * i, 0.5 , 0);

    spot = new THREE.SpotLight('white',0.5,10,1,0.3);
    spot.castShadow = true;
    spot.target = PicturesMesh;
    spot.position.set(-8 * i, 5 , 0.2);
    pictures.push(PicturesMesh);
    spots.push.(spot);
    scene.add(PicturesMesh,spot);
}