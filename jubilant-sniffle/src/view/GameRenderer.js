import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import config from './renderingConfig.json';
export class GameRenderer{
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addLights(this.scene);
        this.scene.add(new THREE.AxesHelper(config.cube.edgeLen));
    }
    animate(){
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
    createCamera(){
        const camera = new THREE.PerspectiveCamera(config.camera.fov, window.innerWidth / window.innerHeight, config.camera.near, config.camera.far);
        camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);
        camera.lookAt(config.camera.lookAt.x, config.camera.lookAt.y, config.camera.lookAt.z);
        return camera;
    }
    createRenderer(){
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
    addLights(scene){
        scene.add(new THREE.AmbientLight(config.lighting.ambient.color, config.lighting.ambient.intensity));
        
        const dirLight = new THREE.DirectionalLight(config.lighting.directional.color, config.lighting.directional.intensity);
        dirLight.position.set(config.lighting.directional.position.x, config.lighting.directional.position.y, config.lighting.directional.position.z);
        scene.add(dirLight);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}