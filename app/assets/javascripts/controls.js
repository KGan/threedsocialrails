define(['three', 'camera'], function(THREE, camera) {
  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  return controls;
});