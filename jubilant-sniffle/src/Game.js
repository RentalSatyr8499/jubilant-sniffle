import config from './view/renderingConfig.json';
import { Cube } from './model/Cube';
import { GameRenderer } from './view/GameRenderer';
import { CubeRenderer } from './view/CubeRenderer';
import { GameController } from './controller/GameController';
import { hitTestFactory } from './view/HitTestFactory';


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
    this.cubeRenderer = new CubeRenderer(this.renderer, this.state); // V
    this.renderer.showBoardView();

    // 3) set up controller
    this.controller = new GameController(hitTestFactory(this.camera, this.scene));
  
    // 4) start loop
    this.start();
  }

  start() {
    const loop = () => {
      // this.state.update();
      // this.cubeRenderer.updateFromState();
      this.renderer.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
