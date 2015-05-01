define(['three'], function (THREE) {
  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // renderer.setClearColor( new THREE.Color(0x9daaaa, 0));
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.autoClear = false;

  renderer.domElement.style.position = "relative";
  container.appendChild( renderer.domElement );

  return renderer;
});
