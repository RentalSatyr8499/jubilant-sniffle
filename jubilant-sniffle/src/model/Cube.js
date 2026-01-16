import { Face } from "./Face";
import { Piece } from "./Piece";
import config from "./modelConfig.json";

export class Cube {
    constructor(faceSize){
        this.faces = this.createFaces(faceSize);
    }
    createFaces(size){
        let faces = [];
        for (let i = 1; i < 7; i++){
            faces.push(new Face(i, size, this));
        }
        return faces;
    }
    getRelativeSquare(square, dx, dy) {
        let current = square;

        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);

        for (let i = 0; i < Math.abs(dx); i++) {
            current = current.face.stepFrom(current, stepX, 0);
        }

        for (let i = 0; i < Math.abs(dy); i++) {
            current = current.face.stepFrom(current, 0, stepY);
        }

        return current;
    }


    toJSON(){
        let json = {
            cube: {}
        };

        const serializeSquare = (square) => {
            return `${config.serialization.stickerColor[square.color]}${config.serialization.pieceType[square.piece.type]}${config.serialization.pieceColor[square.piece.color]}`;
        }
        this.faces.forEach((face, f) => {
            let currFace = "";
            face.board.forEach((row, r) => {
                row.forEach((square, s) => {
                    currFace += serializeSquare(square);
                })
            })
            json[`face${f+1}`] = currFace;
        })

        return json;
    }
    fromJSON(json) {
        const reverseLookup = (map) => {
            const rev = {};
            for (const [key, val] of Object.entries(map)) {
                rev[val] = key;
            }
            return rev;
        };

        const stickerColorRev = reverseLookup(config.serialization.stickerColor);
        const pieceTypeRev    = reverseLookup(config.serialization.pieceType);
        const pieceColorRev   = reverseLookup(config.serialization.pieceColor);

        this.faces.forEach((face, f) => {
            const faceKey = `face${f + 1}`;
            const encoded = json[faceKey]; // e.g. "105000..."
            const size = face.size;

            let idx = 0;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const triplet = encoded.slice(idx, idx + 3);
                    idx += 3;

                    const stickerCode    = parseInt(triplet[0], 10);
                    const pieceTypeCode  = parseInt(triplet[1], 10);
                    const pieceColorCode = parseInt(triplet[2], 10);

                    const square = face.board[r][c];

                    // restore sticker color
                    square.color = stickerColorRev[stickerCode];

                    // restore piece
                    const type  = pieceTypeRev[pieceTypeCode];
                    const color = pieceColorRev[pieceColorCode];

                    if (type && color && type !== "none") {
                        square.piece = new Piece(type, square, color);
                    } else {
                        // keep the "empty" piece consistent with your constructor
                        square.piece = new Piece("none", square, "none");
                    }
                }
            }
            face.board[0][0].piece = new Piece("pawn", face.board[0][0], "white");
        });

        return this;
    }

}