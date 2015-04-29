define(['three'], function (THREE) {
  var letterGeo, letters = {};
  letters.textWidth = 50;
  letters.textSize = 100;

  letters.newMaterial = function () {
    return new THREE.MeshPhongMaterial({
      color: 0xaaaaff,
      shading: THREE.FlatShading,
      refractionRatio: 0.6,
      reflectivity: 0.2,
      specular: 0xffcccc,
      shininess: 20,
    });
  };

  letters.material = letters.newMaterial();

  var chars = [].concat.apply([], Array(94))
    .map(function(_, i) {
      return String.fromCharCode(i+33);
    });



  for(var i = 0; i < chars.length; i++) {
    letterGeo = new THREE.TextGeometry( chars[i], {
      size: letters.textSize,
      height: letters.textWidth,
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
    letters[chars[i]] = new THREE.Mesh(letterGeo, letters.material);
  }

  return letters;
});
