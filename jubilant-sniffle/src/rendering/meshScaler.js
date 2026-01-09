import * as THREE from 'three';

export function scaleMeshToX(mesh, targetX) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  const factor = targetX / size.x;
  mesh.scale.setScalar(factor);
  return mesh;
}
