import { add } from 'three/tsl';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({  
  canvas: document.getElementById('bg') 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.setZ(30);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

function addBoard(scene) {
  const boardSize = 8;       // 8x8 squares
  const squareSize = 1;      // each square is 1 unit
  const totalSize = boardSize * squareSize;

  // 1. Define the board outline as a Shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(totalSize, 0);
  shape.lineTo(totalSize, totalSize);
  shape.lineTo(0, totalSize);
  shape.lineTo(0, 0);

  // 2. Extrude the shape to make a beveled wooden board
  const extrudeSettings = {
    depth: 0.3,              // thickness of the board
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
  const boardMesh = new THREE.Mesh(geometry, material);

  // Center the board
  boardMesh.rotation.x = -Math.PI / 2;
  boardMesh.position.set(-totalSize / 2, 0, totalSize / 2);

  scene.add(boardMesh);

  // 3. Add the checkerboard squares on top
  const group = new THREE.Group();
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
      const isWhite = (x + y) % 2 === 0;
      const material = new THREE.MeshPhongMaterial({
        color: isWhite ? 0xffffff : 0x000000,
        side: THREE.DoubleSide
      });

      const square = new THREE.Mesh(geometry, material);
      square.rotation.x = -Math.PI / 2;
      square.position.set(
        x * squareSize - totalSize / 2 + squareSize / 2,
        0.31, // slightly above the extruded base
        y * squareSize - totalSize / 2 + squareSize / 2
      );

      group.add(square);
    }
  }

  scene.add(group);
}
addBoard(scene);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}


animate();