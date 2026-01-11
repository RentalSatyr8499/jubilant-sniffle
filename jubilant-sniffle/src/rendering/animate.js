import { CubeRenderer } from "./CubeRenderer";
import { GameRenderer } from "./GameRenderer";
import { Cube } from '../state/Cube.js';
import config from './renderingConfig.json';

import { Piece } from '../state/Face.js';
const starterCube = new Cube(8);
const startingFace = starterCube.faces[0];
const backRanks = (rank, color) => {
    rank[0].piece = new Piece("rook", rank[0], color);
    rank[1].piece = new Piece("knight", rank[1], color);
    rank[2].piece = new Piece("bishop", rank[2], color);
    rank[3].piece = new Piece("king", rank[3], color);
    rank[4].piece = new Piece("queen", rank[4], color);
    rank[5].piece = new Piece("bishop", rank[5], color);
    rank[6].piece = new Piece("knight", rank[6], color);
    rank[7].piece = new Piece("rook", rank[7], color);
}
const pawnRank = (rank, color) => {
    for (let i = 0; i < 8; i++){
        rank[i].piece = new Piece("pawn", rank[i], color);
    }
}
backRanks(startingFace.board[0], "white");
backRanks(startingFace.board[7], "black");
pawnRank(startingFace.board[1], "white");
pawnRank(startingFace.board[6], "black");

// switch king and queen for black
startingFace.board[7][4].piece.type = "king";
startingFace.board[7][3].piece.type = "queen"; 

function downloadJSON(obj, filename = "start.json") {
  const jsonString = JSON.stringify(obj, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// Usage
downloadJSON(starterCube.toJSON(), "start.json");

// next: download json and keep in public/
// then read from it upon creating a new game
// then do some shading work (can't really see the black pieces)
// then get started on ui!


const gameRenderer = new GameRenderer();
const game = new Game();
let cubeRenderer = new CubeRenderer(gameRenderer, game.state);
cubeRenderer.cubeMesh.rotation.x += Math.PI/2;
cubeRenderer.cubeMesh.rotation.y += Math.PI;

export function animate(){
    cubeRenderer.cubeMesh.rotation.z += 0.005;

    gameRenderer.animate();

    requestAnimationFrame(animate);
}
