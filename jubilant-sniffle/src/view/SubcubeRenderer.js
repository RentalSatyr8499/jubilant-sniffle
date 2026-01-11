// i can't.  i give up. this is impossible







import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import config from './renderingConfig.json';


export class SubcubeRenderer {
    constructor(size, maxCount = (config.cube.numSquares^2)*6 + 10) {
        this.maxCount = maxCount;
        this.size = size;
        this.radius = size * config.cube.cornerRadiusRatio;

        // Instanced meshes
        this.cubeInstanced = new THREE.InstancedMesh(
            new RoundedBoxGeometry(this.size, this.size, this.size, config.cube.roundedSegments, this.radius), 
            new THREE.MeshStandardMaterial({ color: config.cube.subcubeColor }), 
            this.maxCount
        );
        this.stickerInstanced = new THREE.InstancedMesh(
            new THREE.PlaneGeometry(size * config.cube.stickerSize, size * config.cube.stickerSize), 
            new THREE.MeshStandardMaterial({color: '#ffffff', side: THREE.DoubleSide}), 
            maxCount
        );
    }

    newInstance() {
        // create an instance of the cube mesh at (0, 0, 0)
        // create an instance of the sticker mesh at (0, 0, this.size / 2 + config.cube.stickerOffset)
        // return a THREE.Group() containing those instances
    }

    hideCube(index) {
        // hides cube
    }

    /**
     * Add both instanced meshes to a scene/group
     */
    addTo(sceneOrGroup) {
        sceneOrGroup.add(this.cubeInstanced);
        sceneOrGroup.add(this.stickerInstanced);
    }
}
