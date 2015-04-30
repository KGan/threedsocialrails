define(['three', 'camera', 'tween'], function(THREE, camera, TWEEN) {
  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  return controls;
});
