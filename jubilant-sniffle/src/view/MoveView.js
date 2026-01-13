import * as THREE from 'three';
// some sort of helper class that wraps around moves?

export class MoveView{
    constructor(cube, move){
        this.cube = cube;
        this.move = move;
    }
    setValidMoves(){
        const possibleSquares = this.move.piece.getPossibleSquares(this.cube.board);
        possibleSquares.forEach( (move, m) => {
            // get sticker mesh somehow?..
            // add a gray circle to the middle of planar sticker mesh
        })
    }
    setValidAttacks(){
        // follow setValidMoves structure but for attacks
    }
}