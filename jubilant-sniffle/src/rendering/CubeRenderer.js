import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import config from './renderingConfig.json';
import { loadMesh } from './modelLoader';
import { scaleMeshToX } from './meshScaler';

export class CubeRenderer {
  constructor(gameRenderer, cubeModel, edgeLen = config.cube.edgeLen, numSquares = config.cube.numSquares) {
    this.gameRenderer = gameRenderer;

    this.edgeLen = edgeLen;
    this.numSquares = numSquares;
    this.squareSize = this.edgeLen/this.numSquares;

    this.cubeModel = cubeModel;
    this.cubeMesh = this.createCubeMesh(); 
  }

    createCubeMesh() {
        const cubeMesh = new THREE.Group();

        this.createSubcubes(cubeMesh);
        this.removeOverlappingCubes(cubeMesh);

        this.gameRenderer.scene.add(cubeMesh);
        return cubeMesh;
    }
    createSubcubes(cubeMesh){
        this.cubeModel.faces.forEach((face, f) => {
            const currFace = new THREE.Group();
            face.board.forEach((row, r) => {
                const currRow = new THREE.Group();
                row.forEach((subcube, s) => {
                        const currSubcube = this.createSubcubeMesh(this.squareSize, subcube);
                        this.positionSubcube(currSubcube, s);
                        currRow.add(currSubcube);      
                });
                this.positionRow(currRow, r);
                currFace.add(currRow);
                //}
            });
            this.positionFace(currFace, f);
            cubeMesh.add(currFace);         
        });
    }
    removeOverlappingCubes(cubeMesh) {
        const renderedSubcubes = new Set();
        cubeMesh.children.forEach(face => {
            face.children.forEach(row => {
                row.children.forEach(subCube => {
                    subCube.updateWorldMatrix(true, false);
                    const pos = new THREE.Vector3();
                    subCube.getWorldPosition(pos);

                    const key = `${pos.x.toFixed(5)},${pos.y.toFixed(5)},${pos.z.toFixed(5)}`;
                    if (renderedSubcubes.has(key)) {
                        subCube.children.forEach(child => {
                            if (child.geometry instanceof RoundedBoxGeometry) {
                                subCube.remove(child);
                                child.geometry.dispose();
                                child.material.dispose();
                            }
                        });
                    } else {
                        renderedSubcubes.add(key);
                    }
                });
            });
        });
    }
    createSubcubeMesh(size, squareModel) {    
        const subCube = new THREE.Group();

        const radius = size * config.cube.cornerRadiusRatio;
        const cube = new THREE.Mesh( // cube
            new RoundedBoxGeometry(size, size, size, config.cube.roundedSegments, radius),
            new THREE.MeshStandardMaterial({color: config.cube.subcubeColor})
        );
        subCube.add(cube);

        const sticker = new THREE.Mesh( // sticker
            new THREE.PlaneGeometry(size*config.cube.stickerSize, size*config.cube.stickerSize), 
            new THREE.MeshStandardMaterial({
                color: squareModel.color,
                side: THREE.DoubleSide
            }
        ));
        sticker.position.z = size / 2 + config.cube.stickerOffset;
        subCube.add(sticker);

        const path = config.piece.pieceMeshDirectory + squareModel.piece + ".glb";
        console.log(path);
        loadMesh(path).then((pieceMesh) => { // piece
            pieceMesh.position.z = sticker.position.z;
            subCube.add(scaleMeshToX(pieceMesh, size*config.piece.pieceSize));
        });

        return subCube;
    }
    positionSubcube(subcubeMesh, i) {
        subcubeMesh.position.x = (i - this.numSquares / 2 + 0.5) * this.squareSize;
    }
    positionRow(rowMesh, i) {
        rowMesh.position.y = (i - this.numSquares / 2 + 0.5) * this.squareSize;
    }
    positionFace(faceMesh, i){
        const faceOffset = (this.edgeLen / 2) - (this.squareSize / 2);
        switch (i) {
            case 0: // front
                faceMesh.position.z = faceOffset;
                break;
            case 1: // back
                faceMesh.position.z = -faceOffset;
                faceMesh.rotation.y = Math.PI;
                break;
            case 2: // right
                faceMesh.position.x = faceOffset;
                faceMesh.rotation.y = -3*Math.PI / 2;
                break;
            case 3: // left
                faceMesh.position.x = -faceOffset;
                faceMesh.rotation.y = 3*Math.PI / 2;
                break;
            case 4: // top
                faceMesh.position.y = faceOffset;
                faceMesh.rotation.x = -Math.PI / 2;
                break;
            case 5: // bottom
                faceMesh.position.y = -faceOffset;
                faceMesh.rotation.x = Math.PI / 2;
                break;
        }
    }
}
