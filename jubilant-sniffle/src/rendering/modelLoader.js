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
