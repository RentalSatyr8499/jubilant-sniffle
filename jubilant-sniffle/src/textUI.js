const king = "♔";
const queen = "♕";
const rook = "♖";
const bishop = "♗";
const knight = "♘";
const pawn = "♙";

function shiftRank (rank, shift) {
    var files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return files[(files.indexOf(rank) + shift) % 8];
}

class Square {
    constructor(rank, file, piece = " ") {
        this.rank = rank;
        this.file = file;
        this.piece = piece;
    }

    toString() { return "[" + this.piece + "]"; }
    getRank() { return this.rank; }
    getFile() { return this.file; }
    getPiece() { return this.piece; }
    setPiece(piece) { this.piece = piece; }
    coordinateEquals (otherSquare) {
        return this.rank === otherSquare.getRank() && this.file === otherSquare.getFile();
    }
}
class Snake {
    constructor(position) {
        this.position = position;
        this.files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }
    validatePosition (bodySegments) {
        var validPositions;
        for (let i = 1; i < bodySegments.length; i++) {
            let file = bodySegments[i].charAt(0);
            let rank = parseInt(bodySegments[i].charAt(1));
            
            let prevFile = bodySegments[i - 1].getFile();
            let prevRank = bodySegments[i - 1].getRank();

            validPositions = [
                new Square(prevRank + 1, prevFile),
                new Square(prevRank - 1, prevFile),
                new Square(prevRank, shiftRank(prevFile, 1)),
                new Square(prevRank, shiftRank(prevFile, -1))
            ]
            
            for (let j = 0; j < validPositions.length; j++) {
                if (validPositions[j].coordinateEquals(new Square(rank, file))) {
                    return true;
                }
            }
        }
        return false;
    }
}
class Board {
    constructor() {
        this.board = this.fillBoard();
        this.files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }
    addSquares (board) {
        for (var r = 8; r > 0; r--) {
            var rank = [];
            for (let f = 0; f < files.length; f++) {
                const square = new Square(r, files[f]);
                rank.push(square);
            }
            board.push(rank);
        }
        return board;
    }
    setSquare (coordinate, piece) {
        const file = coordinate.charCodeAt(0) - 'A'.charCodeAt(0);
        const rank = 8 - parseInt(coordinate.charAt(1));
        this.board[rank][file].setPiece(piece);
    }
    addWhitePieces (board) {
        this.setSquare(1, "A", rook);
        this.setSquare(1, "B", knight);
        this.setSquare(1, "C", bishop);
        this.setSquare(1, "D", queen);
        this.setSquare(1, "E", king);
        this.setSquare(1, "F", bishop);
        this.setSquare(1, "G", knight);
        this.setSquare(1, "H", rook);   
        for (var f = 0; f < this.files.length; f++) {
            this.setSquare(2, this.files[f], pawn);
        }
        return board; 
    }
    addSnake () {
        this.setSquare("E4", "🐍");
    }
}


function printBoard(board) {
    var output = "";
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            output += board[i][j].toString();
        }
        output += "\n";
    }
    console.log(output);
}

var board = fillBoard([]);
printBoard(board);