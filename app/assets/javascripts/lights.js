define(['scene', 'three', 'tween'], function (scene, THREE, TWEEN) {
  var light1 = new THREE.PointLight( 0xffffff, 0.28, 15000 );
  light1.position.set( 0, -3000, 0 );
  scene.add( light1 );

  new TWEEN.Tween (light1.position)
  	.to({x: 0, y: 3000, z: 0}, 5000)
  	.repeat(Infinity)
  	.yoyo(true)
  	.start();


  var light2 = new THREE.PointLight( 0xffffff, 0.28, 15000 );
  light2.position.set( -3000, 0, 1 );
  scene.add( light2 );

  new TWEEN.Tween (light2.position)
    .to({x: 3000, y: 0, z: 0}, 3500)
    .repeat(Infinity)
    .yoyo(true)
    .start();
  // 
  // var light3 = new THREE.PointLight( 0x999999, 0.28, 150000 );
  // light3.position.set( 0, 0, 3000 );
  // scene.add( light3 );
  //
  // new TWEEN.Tween (light3.position)
  //   .to({x: 0, y: 0, z: -3000}, 4200)
  //   .repeat(Infinity)
  //   .yoyo(true)
  //   .start();

});
