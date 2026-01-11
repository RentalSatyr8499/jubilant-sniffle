import * as THREE from 'three';

export function hitTestFactory(camera, scene) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  return (x, y) => {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    return intersects.length ? intersects[0].object : null;
  };
}
