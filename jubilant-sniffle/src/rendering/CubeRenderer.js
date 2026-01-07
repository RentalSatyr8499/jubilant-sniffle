import * as THREE from 'three';
import { Cube } from '../state/Cube.js';

export class CubeRenderer {
  constructor(gameRenderer, edgeLen) {
    this.numSquares = 8;
    this.gameRenderer = gameRenderer;
    this.cube = new Cube(this.numSquares); 
    this.edgeLen = edgeLen;

    this.subcubes = []; 
    this.subcubeSize = this.edgeLen/8;
    this.faceOffset = this.edgeLen / 2;
    this.squareSize = this.edgeLen/this.numSquares;

  }

  render() {
    const cube = new THREE.Group();

    this.cube.faces.forEach((face, f) => {
        const currFace = new THREE.Group();
        face.board.forEach((row, r) => {
            const currRow = new THREE.Group();
            row.forEach((subcube, s) => {
                const currSubcube = this.createSubcubeMesh(this.squareSize);
                this.positionSubcube(currSubcube, s);
                currRow.add(currSubcube);                
            });
            this.positionRow(currRow, r);
            currFace.add(currRow);
        });
        this.positionFace(currFace, f);
        cube.add(currFace);         
    });
    // cube.add(this.createSubcubeMesh(this.subcubeSize));

    this.gameRenderer.scene.add(cube);
    }

    createSubcubeMesh(size){
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
            });
        return new THREE.Mesh(geometry, material);
    }
    positionSubcube(subcubeMesh, i) {
        subcubeMesh.position.x = (i - this.numSquares / 2 + 0.5) * this.subcubeSize;
    }

    positionRow(rowMesh, i) {
        rowMesh.position.y = (i - this.numSquares / 2 + 0.5) * this.subcubeSize;
    }

    positionFace(faceMesh, i){
        switch (i) {
            case 0: // front
                faceMesh.position.z = this.faceOffset;
                break;
            case 1: // back
                faceMesh.position.z = -this.faceOffset;
                faceMesh.rotation.y = Math.PI;
                break;
            case 2: // right
                faceMesh.position.x = this.faceOffset;
                faceMesh.rotation.y = -Math.PI / 2;
                break;
            case 3: // left
                faceMesh.position.x = -this.faceOffset;
                faceMesh.rotation.y = Math.PI / 2;
                break;
            case 4: // top
                faceMesh.position.y = this.faceOffset;
                faceMesh.rotation.x = -Math.PI / 2;
                break;
            case 5: // bottom
                faceMesh.position.y = -this.faceOffset;
                faceMesh.rotation.x = Math.PI / 2;
                break;
        }
    }
}
