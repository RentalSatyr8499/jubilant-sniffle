import { HoverHighlighter } from "./HoverHighlighter";
import * as THREE from 'three';

export class GameController{
    constructor(hitTest){
        this.highlighter = new HoverHighlighter(
            hitTest,
            new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.5
            })
        );

    }
    update(){
        this.highlighter.update();
    }
}