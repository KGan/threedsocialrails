define(['three'], function (THREE){
  var textWidth = 50;
  var textSize = 100;

  var chars = [].concat.apply([], Array(94))
    .map(function(_, i) {
      return String.fromCharCode(i+33);
    });

  var letterMaterial = new THREE.MeshPhongMaterial( {
    color: 0xaaaaff,
    shading: THREE.FlatShading,
    refractionRatio: 0.6,
    reflectivity: 0.2,
    specular: 0xffcccc,
    shininess: 20,
    transparent: true,
    opacity: 0
  });

  // 	tds.letterMaterial = new THREE.MeshBasicMaterial( {
  //       color: 0xccccff,
  //       refractionRatio: 0.6,
  // 			transparent: true,
  // 			opacity: 1
  // } );

  var letterGeo, letters = {};

  for(var i = 0; i < chars.length; i++) {
    letterGeo = new THREE.TextGeometry( chars[i], {
      size: textSize,
      height: textWidth,
      curveSegments: 3,
      font: "helvetiker",
      weight: "normal",
      style: "normal",
      material: 0,
      extrudeMaterial: 1
    });

    letterGeo.computeBoundingBox();
    letterGeo.computeVertexNormals();

    var centerOffset = -0.5 * ( letterGeo.boundingBox.max.x - letterGeo.boundingBox.min.x );
    letters[chars[i]] = new THREE.Mesh( letterGeo, tds.letterMaterial );
  }

  return letters;
});
