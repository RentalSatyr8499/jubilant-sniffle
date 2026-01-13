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
        for (const [dr, dc] of directions) {
            let step = 1;
            while (true) {
                const target = this.square.offset(dr * step, dc * step);
                if (!target.isValid()) break;

                if (board.isEmpty(target)) {
                    moves.push(target);
                } else {
                    if (!board.isFriendly(target, this.color)) {
                        moves.push(target);
                    }
                    break;
                }
                step++;
            }
        }
        return moves;
    }

    getPawnMoves(board) {
        return [];
    }
}
