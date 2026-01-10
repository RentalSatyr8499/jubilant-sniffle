import { Face } from "./Face";
import config from "./stateConfig.json";

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
        const pieceTypeRev   = reverseLookup(config.serialization.pieceType);
        const pieceColorRev  = reverseLookup(config.serialization.pieceColor);

        this.faces.forEach((face, f) => {
            const faceKey = `face${f+1}`;
            const encoded = json[faceKey]; // e.g. "105000..."
            const size = face.size;

            let idx = 0;
            for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const triplet = encoded.slice(idx, idx+3);
                idx += 3;

                const stickerCode = parseInt(triplet[0], 10);
                const pieceTypeCode = parseInt(triplet[1], 10);
                const pieceColorCode = parseInt(triplet[2], 10);

                const square = face.board[r][c];
                square.color = stickerColorRev[stickerCode];

                if (pieceTypeCode !== undefined && pieceColorCode !== undefined) {
                square.piece = {
                    type: pieceTypeRev[pieceTypeCode],
                    color: pieceColorRev[pieceColorCode]
                };
                } else {
                square.piece = null; // empty square
                }
            }
            }
        });
    }
}