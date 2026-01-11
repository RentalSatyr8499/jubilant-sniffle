import { CubeRenderer } from "./CubeRenderer.js";
import { GameRenderer } from "./GameRenderer.js";
import { Game } from '../Game.js';

const gameRenderer = new GameRenderer();
const game = new Game();
await game.init();
let cubeRenderer = new CubeRenderer(gameRenderer, game.state);

cubeRenderer.cubeMesh.rotation.x += Math.PI/2;
cubeRenderer.cubeMesh.rotation.y += Math.PI;

export function animate(){
    cubeRenderer.cubeMesh.rotation.z += 0.005;

    gameRenderer.animate();

    requestAnimationFrame(animate);
}
