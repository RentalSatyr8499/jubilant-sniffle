import { CubeRenderer } from "./CubeRenderer";
import { GameRenderer } from "./GameRenderer";
import * as THREE from 'three';

import { Cube } from '../state/Cube.js';
import config from './renderingConfig.json';


const gameRenderer = new GameRenderer();
let cubeRenderer = new CubeRenderer(gameRenderer, new Cube(config.cube.numSquares));

export function animate(){
    cubeRenderer.cubeMesh.rotation.z += 0.005;
    cubeRenderer.cubeMesh.rotation.x += 0.005;

    gameRenderer.animate();

    requestAnimationFrame(animate);
}
