import * as THREE from 'three';

export class HighlightView {
  constructor() {
    this.highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5
    });

    this.originalMaterial = null;
    this.current = null;
  }

  setHighlighted(target) {
    // restore old
    if (this.current) {
      this.current.material = this.originalMaterial;
    }

    // apply new
    if (target) {
      this.current = target;
      this.originalMaterial = target.material;
      target.material = this.highlightMaterial;
    } else {
      this.current = null;
      this.originalMaterial = null;
    }
  }
}
