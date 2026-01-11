import './style.css'
// import { animate } from './view/animate.js';
import { Game } from './Game.js';

const game = new Game();
await game.init();

// animate();