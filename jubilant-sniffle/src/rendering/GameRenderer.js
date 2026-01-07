import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export class GameRenderer {
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 0, 400);
        this.camera.lookAt(0, 0, 0);

        this.scene.add(new THREE.AxesHelper(200));
    }
    animate(){
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
}