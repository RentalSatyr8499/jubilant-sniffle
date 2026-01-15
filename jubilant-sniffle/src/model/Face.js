import config from './modelConfig.json';
import { Piece } from './Piece'

class Square {
    constructor(file, rank, color = "#ffffff", face){
        this.piece = new Piece("none", this, "none");
        this.file = file;
        this.rank = rank;
        this.coordinates = `${file}${rank}`;
        this.color = color;
        this.face = face;
    }
    isEmpty(){ return this.piece.type === "none"; }
}

export class Face {
    constructor(id, size){
        this.id = id;
        this.size = size;
        this.color = config.newFaceColors[`${id}`];
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
            row.push(new Square(f, r, this.color, this));
        }
        return row;
    }
}