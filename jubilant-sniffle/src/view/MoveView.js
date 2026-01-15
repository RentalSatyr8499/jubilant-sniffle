import * as THREE from 'three';
import { getStickerFromSubcube } from './meshUtils';

export class MoveView {
    constructor(cubeView) {
        this.cubeView = cubeView;
    }

    showValidMoves(moves) {
        moves.forEach(square => {

            const sticker = getStickerFromSubcube(this.cubeView.modelToMesh.get(square));

            if (!sticker) return;

            const indicator = new THREE.Mesh(
                new THREE.CircleGeometry(0.2),
                new THREE.MeshBasicMaterial({ color: 0x888888 })
            );

            indicator.position.set(0,0,0.01);
            sticker.add(indicator);
        });
    }
}
