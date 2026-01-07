class Piece {
    constructor(type, square){
        this.type = type;
        this.square = square;
    }
}

class Square {
    constructor(file, rank){
        this.piece = undefined;
        this.file = file;
        this.rank = rank;
        this.coordinates = file + rank;
    }
    isEmpty(){ return !!this.piece; }
}
class Face {
    constructor(id, size){
        this.id = id;
        this.size = size;
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
            row.push(new Square(f, r));
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
        for (let i = 0; i < 6; i++){
            faces.push(new Face(i, size));
        }
        return faces;
    }
}