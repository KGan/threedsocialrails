define(['scene'], function (THREE) {
  var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light1.position.set( 10, 1, 1 );
  scene.add( light1 );

  // new TWEEN.Tween (light1.position)
  // 	.to({x: 8000, y: 5000, z: -5000}, 5000)
  // 	.repeat(Infinity)
  // 	.yoyo(true)
  // 	.start();

  var light2 = new THREE.DirectionalLight( 0xffffff, 0.6 );
  light2.position.set( 5, 700, 1 );
  scene.add( light2 );

  new TWEEN.Tween (light2.position)
    .to({x: 0, y: -700, z: 0}, 4000)
    .repeat(Infinity)
    .yoyo(true)
    .start();


  var light3 = new THREE.DirectionalLight( 0x999999, 0.6 );
  light3.position.set( 0, 800, 9000 );
  scene.add( light3 );
});
