import config from './view/renderingConfig.json';
import { Cube } from './model/Cube';
import { GameRenderer } from './view/GameRenderer';
import { CubeView } from './view/CubeView';
import { GameController } from './controller/GameController';
import { hitTestFactory } from './view/HitTestFactory';

import { MoveView } from './view/MoveView';
import { cubeMapNode } from 'three/src/nodes/utils/CubeMapNode.js';


export class Game {
  constructor() {
    this.state = null;
    this.renderer = null;
    this.controller = null;
  }

  async init() {
    const res = await fetch("./newGameState.json");
    const obj = await res.json();

    this.state = (new Cube(config.cube.numSquares)).fromJSON(obj); // M

    this.renderer = new GameRenderer();
    this.cubeRenderer = new CubeView(this.renderer, this.state); // V
    this.renderer.showBoardView();

    // 3) set up controller
    this.controller = new GameController(hitTestFactory(this.renderer.camera, this.renderer.scene));
  
    // 4) start loop
    this.start();
  }

  start() {
    const loop = () => {
      // this.state.update();
      // this.cubeRenderer.updateFromState();
      this.renderer.render();
      this.controller.update();
      console.log(this.cubeRenderer.cubeMesh);
      this.cubeRenderer.cubeMesh.rotation.y += 0.005;
      requestAnimationFrame(loop);
    };

    const q = this.state.faces[0].board[0][4].piece;
    // (new MoveView(this.cubeRenderer)).showValidMoves(q.getPossibleSquares(this.state.faces[0].board));
    loop();
  }
}
