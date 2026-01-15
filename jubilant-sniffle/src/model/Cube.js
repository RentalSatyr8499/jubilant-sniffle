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
            faces.push(new Face(i, size));
        }
        return faces;
    }
    getRelativeSquare(square, dx, dy) {
        const face = square.face;
        const size = face.size;

        let nx = square.file + dx;
        let ny = square.rank + dy;

        // 1. If still inside the same face, return directly
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
            return face.board[ny][nx];
        }

        // 2. Determine which edge was crossed
        let direction = null;

        if (nx < 0) direction = "left";
        else if (nx >= size) direction = "right";
        else if (ny < 0) direction = "up";
        else if (ny >= size) direction = "down";

        if (!direction) return null; // shouldn't happen
    
        // the following code is wrong because it doesn't account for cases where the relative square lives multiple faces away.
        // also maybe the task of getting neighboring faces should be delegated to Face.js.
        /*
        // 3. Look up neighbor face + rotation
        const neighbor = config.faceNeighbors[face.id][direction];
        const newFaceId = neighbor.face;
        const rotation = neighbor.rotation;

        const newFace = this.faces[newFaceId - 1]; // faces are 1-indexed in config

        // 4. Compute coordinates relative to the edge
        let localX = nx;
        let localY = ny;

        // Move into the coordinate space where (0..size-1) is valid
        if (direction === "left")  localX = size - 1;
        if (direction === "right") localX = 0;
        if (direction === "up")    localY = size - 1;
        if (direction === "down")  localY = 0;

        // 5. Apply rotation to map coordinates onto the new face
        let [fx, fy] = this.applyRotation(localX, localY, size, rotation);

        return newFace.board[fy][fx];
        */
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