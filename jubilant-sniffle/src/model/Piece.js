import config from './modelConfig.json';

export class Piece {
    constructor(type, square, color){
        this.type = type;
        this.square = square;
        this.color = color;
    }

    getPossibleSquares(board){
        const rule = config.movement[this.type];

        if (rule.type === "offsets") {
            return this.getOffsetMoves(rule.offsets, board);
        }

        if (rule.type === "rays") {
            return this.getRayMoves(rule.directions, board);
        }

        if (rule.type === "special") {
            return this.getPawnMoves(board);
        }
    }

    getOffsetMoves(offsets, board) {
        const moves = [];
        for (const [dr, dc] of offsets) {
            const target = this.square.offset(dr, dc); // what should i replace this with?
            if (target.isValid() && !board.isFriendly(target, this.color)) {
                moves.push(target);
            }
        }
        return moves;
    }

    getRayMoves(directions, board) {
        const moves = [];

        for (const [dx, dy] of directions) {
            let step = 1;

            while (true) {
            const target = this.square.add(dx * step, dy * step);

            if (!board.isInside(target)) break;

            moves.push(target);

            if (board.isOccupied(target)) break; // stop through pieces

            step++;
            }
        }

        return moves;
        }


    getPawnMoves(board) {
        return [];
    }
}
