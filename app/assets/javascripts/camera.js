define(['three'], function (THREE) {
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 25000 );
  camera.position.z = 0;
  return camera;
});
