class Square {
    constructor(piece, file, rank){
        this.piece = piece;
        this.file = file;
        this.rank = rank;
        this.coordinates = file + rank;
    }
}
class Face {
    constructor(id, size){
        this.id = id;
        this.size = size;
        this.board = this.createBoard;
    }
    createBoard(){
        let board = [];
        for (let r = 0; r < this.size; r++){
            this.board.append(this.createRow(r));
        }
        return board;
    }
    createRow(rank){
        let row = [];
        for (let f = 0; f < this.size; f++){
            row.append(new Square(undefined, f, rank));
        }
        return row;
    }
}
class Cube {
    constructor(numFaces, faceSize){
        this.faces = [];
        for (let i = 0; i < numFaces; i++){
            this.faces.append(new Face(i, faceSize));
        }
    }
    createFace(id){
        
    }
}