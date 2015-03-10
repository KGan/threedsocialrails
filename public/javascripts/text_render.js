var three_is_loaded = false


self.addEventListener('message', function(msg) {
  if (!three_is_loaded) {
    importScripts(msg.data.three, msg.data.helv)
    // renderer = new THREE.WebGLRenderer( { antialias: true } );
    three_is_loaded = true
  }
  var text = msg.data.text
  var text_array = text.split( "\n" )
  var group = new THREE.Group()
  for (var i = 0; i < text_array.length; i++)
  {
    fmp = flying_monkey_piece(text_array[i], i, msg.data.jk)
    group.add(fmp)
  }
  self.postMessage({'group': group.toJSON()})
})


function flying_monkey_piece(text, offset, jk) {

  textGeo = new THREE.TextGeometry( text, {

  		size: jk.textSize,
  		height: jk.textWidth,
  		curveSegments: 1,

  		font: "helvetiker",
  		weight: "normal",
  		style: "normal",

  		material: 0,
  		extrudeMaterial: 1

  	});

  	textGeo.computeBoundingBox();
  	textGeo.computeVertexNormals();

  	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

  	material = new THREE.MeshFaceMaterial( [
  		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
  		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
  	] );

  	textMesh1 = new THREE.Mesh( textGeo, material );
    textMesh1.position.setY( - jk.textSize * offset * 1.5 )
    return textMesh1
  }
