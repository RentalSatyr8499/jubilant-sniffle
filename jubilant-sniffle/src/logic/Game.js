import config from '../rendering/renderingConfig.json';

export class Game{
    constructor(start = './newGameState.json'){
        this.state = new Cube(config.cube.numSquares);
        this.state.fromJSON(start);
    }
}