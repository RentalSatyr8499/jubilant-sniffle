import config from '../rendering/renderingConfig.json';

class Piece {
    constructor(type, square){
        this.type = "pawn";
        this.square = square;
    }
}

class Square {
    constructor(file, rank, color = "#ffffff"){
        this.piece = undefined;
        this.file = file;
        this.rank = rank;
        this.coordinates = file + rank;
        this.color = color;
    }
    isEmpty(){ return !!this.piece; }
}
class Face {
    constructor(id, size){
        this.id = id;
        this.size = size;
        this.color = config.cube.newFaceColors[`${id}`];
        this.board = this.createBoard();
    }
    createBoard(){
        let board = [];
        for (let r = 0; r < this.size; r++){
            board.push(this.createRank(r));
        }
        return board;
    }
    createRank(r){
        let row = [];
        for (let f = 0; f < this.size; f++){
            row.push(new Square(f, r, this.color));
        }
        return row;
    }
}
export class Cube {
    constructor(faceSize){
        this.faces = this.createFaces(faceSize);
    }
    createFaces(size){
        let faces = [];
        for (let i = 1; i < 7; i++){
            faces.push(new Face(i, size));
        }
        return faces;
    }
}