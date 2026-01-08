import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import config from './renderingConfig.json';
import { sub } from 'three/tsl';

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
        const cube = new THREE.Group();

        this.populateNonEdgeCubes(cube);
        this.populateEdgeCubes(cube);

        this.gameRenderer.scene.add(cube);
        return cube;
    }
    populateNonEdgeCubes(cubeMesh){
        const onEdge = (i) => 
            (i==0)||(i==this.cubeModel.faces[0].size-1);

        this.cubeModel.faces.forEach((face, f) => {
            const currFace = new THREE.Group();
            face.board.forEach((row, r) => {
                if (!onEdge(r)){
                    const currRow = new THREE.Group();
                    row.forEach((subcube, s) => {
                        if (!onEdge(s)){
                            const currSubcube = this.createSubcubeMesh(this.squareSize, subcube.color);
                            console.log(subcube.color);
                            this.positionSubcube(currSubcube, s);
                            currRow.add(currSubcube);      
                        }        
                    });
                    this.positionRow(currRow, r);
                    currFace.add(currRow);
                }
            });
            this.positionFace(currFace, f);
            cubeMesh.add(currFace);         
        });
    }
    populateEdgeCubes(cubeMesh) {
        const edgeMesh = new THREE.Group();

        const cornerOffset = (this.edgeLen / 2) - (this.squareSize / 2);
        const idxToCoord = (i) =>
            (i - this.numSquares / 2 + 0.5) * this.squareSize;
        const edgeCubes = [...Array(this.numSquares).keys()];
        const edgePatterns = [
            { free: 'x', fixed: ['y','z'] },
            { free: 'y', fixed: ['x','z'] },
            { free: 'z', fixed: ['x','y'] }
        ];

        edgePatterns.forEach(({ free, fixed }) => {
            [ [-1,-1], [-1,1], [1,-1], [1,1] ].forEach(([s1, s2]) => {
                edgeCubes.forEach(i => {
                    const sub = this.createSubcubeMesh(this.squareSize);
                    const pos = { x:0, y:0, z:0 };

                    pos[free] = idxToCoord(i);
                    pos[fixed[0]] = s1 * cornerOffset;
                    pos[fixed[1]] = s2 * cornerOffset;

                    sub.position.set(pos.x, pos.y, pos.z);
                    edgeMesh.add(sub);
                });
            });
        });

        cubeMesh.add(edgeMesh);
    }
    createSubcubeMesh(size, cubeColor = "#ffffff") {    
        const radius = size * config.cube.cornerRadiusRatio;
        const cube = new THREE.Mesh( // cube
            new RoundedBoxGeometry(size, size, size, config.cube.roundedSegments, radius),
            new THREE.MeshStandardMaterial({color: config.cube.subcubeColor})
        );
        const sticker = new THREE.Mesh( // sticker
            new THREE.PlaneGeometry(size*config.cube.stickerSize, size*config.cube.stickerSize), 
            new THREE.MeshStandardMaterial({
                color: cubeColor,
                side: THREE.DoubleSide
            }
        ));
        sticker.position.z = size / 2 + config.cube.stickerOffset;

        const subCube = new THREE.Group();
        subCube.add(cube);
        subCube.add(sticker);
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
