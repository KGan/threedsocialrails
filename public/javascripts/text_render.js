var three_is_loaded = false


self.addEventListener('message', function(msg) {
  if (!three_is_loaded) {
    importScripts(msg.data.three, msg.data.helv)
    three_is_loaded = true
  }
  var text = msg.data.text
  var text_array = text.split( "\n" )
  var monkey_pieces = []
  for (var i = 0; i < text_array.length; i++) {
    fmp = flying_monkey_piece(text_array[i], i, msg.data.jk)
    monkey_pieces.push( JSON.stringify(fmp.toJSON()) )
  }

  self.postMessage({'monkey_pieces': monkey_pieces})
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



  saveGeometryToJSON = function (geometry) {
      var i,
          json = {
              metadata: {
                  formatVersion: 3
              },
              scale: 1.000000,
              materials: [],
              vertices: [],
              morphTargets: [],
              morphColors: [],
              normals: [],
              colors: [],
              uvs: [[]],
              faces: []
          };

      for (i = 0; i < geometry.vertices.length; i++) {
          json.vertices.push(geometry.vertices[i].position.x);
          json.vertices.push(geometry.vertices[i].position.y);
          json.vertices.push(geometry.vertices[i].position.z);
      }

      for (i = 0; i < geometry.faces.length; i++) {
          if (geometry.faces[i].d) {
              json.faces.push(1);
          } else {
              json.faces.push(0);
          }

          json.faces.push(geometry.faces[i].a);
          json.faces.push(geometry.faces[i].b);
          json.faces.push(geometry.faces[i].c);

          if (geometry.faces[i].d) {
              json.faces.push(geometry.faces[i].d);
          }

          json.normals.push(geometry.faces[i].normal.x);
          json.normals.push(geometry.faces[i].normal.y);
          json.normals.push(geometry.faces[i].normal.z);
      }

      return JSON.stringify(json, null, '<br>');
  }
