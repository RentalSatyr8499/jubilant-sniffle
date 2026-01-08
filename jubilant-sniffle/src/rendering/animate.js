import { CubeRenderer } from "./CubeRenderer";
import { GameRenderer } from "./GameRenderer";
import config from './renderingConfig.json';

const gameRenderer = new GameRenderer();
const cubeRenderer = new CubeRenderer(gameRenderer, config.cube.edgeLen);


export function animate(){
    cubeRenderer.cubeMesh.rotation.z += config.animation.rotationSpeedZ;
    gameRenderer.animate();

    requestAnimationFrame(animate);
}
