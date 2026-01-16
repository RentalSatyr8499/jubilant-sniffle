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
    constructor(id, size, cube){
        this.id = id;
        this.size = size;
        this.color = config.newFaceColors[`${id}`];
        this.board = this.createBoard();
        this.cube = cube;
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
    stepFrom(square, dx, dy) {
        const size = this.size;
        let nx = square.file + dx;
        let ny = square.rank + dy;

        // Still on this face
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
            return this.board[ny][nx];
        }

        // Determine crossed edge
        let direction;
        if (nx < 0) direction = "left";
        else if (nx >= size) direction = "right";
        else if (ny < 0) direction = "up";
        else direction = "down";

        return this.crossEdge(square, direction);
    }
    crossEdge(square, direction) {
        const size = this.size;
        const neighborInfo = config.faceNeighbors[this.id][direction];

        const nextFace = square.face.cube.faces[neighborInfo.face - 1];
        const rotation = neighborInfo.rotation;

        // Coordinate along the edge
        let t;
        if (direction === "left" || direction === "right") {
            t = square.rank;
        } else {
            t = square.file;
        }

        // Map to new face before rotation
        let x, y;
        switch (direction) {
            case "left":
                x = size - 1;
                y = t;
                break;
            case "right":
                x = 0;
                y = t;
                break;
            case "up":
                x = t;
                y = size - 1;
                break;
            case "down":
                x = t;
                y = 0;
                break;
        }

        // Apply rotation
        [x, y] = Face.rotate(x, y, size, rotation);

        return nextFace.board[y][x];
    }
    static rotate(x, y, size, degrees) {
        const max = size - 1;

        switch ((degrees + 360) % 360) {
            case 0:
                return [x, y];
            case 90:
                return [max - y, x];
            case 180:
                return [max - x, max - y];
            case 270:
                return [y, max - x];
            default:
                throw new Error("Invalid rotation");
        }
    }

}