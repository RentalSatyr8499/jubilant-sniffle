import * as THREE from 'three';
import { Cube } from '../state/Cube.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import config from './renderingConfig.json';

export class CubeRenderer {
  constructor(gameRenderer, edgeLen = config.cube.edgeLen) {
    this.gameRenderer = gameRenderer;

    this.edgeLen = edgeLen;
    this.numSquares = config.cube.numSquares;
    this.faceOffset = this.edgeLen / 2;
    this.squareSize = this.edgeLen/this.numSquares;
    this.positionOffset = config.cube.positionOffset;

    this.cubeModel = new Cube(this.numSquares);
    this.cubeMesh = this.createCubeMesh(); 
  }

    createCubeMesh() {
        const cube = new THREE.Group();

        this.cubeModel.faces.forEach((face, f) => {
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

        this.gameRenderer.scene.add(cube);
        return cube;
    }
    createSubcubeMesh(size) {
        const radius = size * config.cube.cornerRadiusRatio; // ratio of size
        const geometry = new RoundedBoxGeometry(size, size, size, config.cube.roundedSegments, radius);
        const material = new THREE.MeshStandardMaterial({
            color: config.cube.subcubeColor,
        });
        return new THREE.Mesh(geometry, material);

    }
    positionSubcube(subcubeMesh, i) {
        subcubeMesh.position.x = (i - this.numSquares / 2 + this.positionOffset) * this.squareSize;
    }
    positionRow(rowMesh, i) {
        rowMesh.position.y = (i - this.numSquares / 2 + this.positionOffset) * this.squareSize;
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
