import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadMesh(path, asGroup = false) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        if (asGroup) {
          resolve(gltf.scene); // return the whole group
        } else {
          let mesh = null;
          gltf.scene.traverse((child) => {
            if (child.isMesh && !mesh) {
              mesh = child;
            }
          });
          resolve(mesh || gltf.scene); // fallback to group if no mesh found
        }
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export function scaleMeshToX(mesh, targetX) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  const factor = targetX / size.x;
  mesh.scale.setScalar(factor);
  return mesh;
}

export function setMeshColor(mesh, targetColor) {
  const color = new THREE.Color(targetColor);

  mesh.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.color) mat.color.copy(color);
          });
        } else {
          if (child.material.color) {
            child.material.color.copy(color);
          }
        }
        child.material.needsUpdate = true;
      }
    }
  });
}

export function getStickerFromSubcube(subcubeGroup) {
    for (const child of subcubeGroup.children) {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
            return child;
        }
    }
    return null;
}
