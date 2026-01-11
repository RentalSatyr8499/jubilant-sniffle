import config from './view/renderingConfig.json';
import { Cube } from './model/Cube';
import { GameRenderer } from './view/GameRenderer';
import { CubeRenderer } from './view/CubeRenderer';


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

    // 3) set up controller
    // this.controller = new InputController(this.state);

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
