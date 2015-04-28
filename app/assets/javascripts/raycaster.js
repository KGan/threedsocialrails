define(['three', 'utils/unique'], function (THREE) {
  var size = 0.03;
  var diffs = [[0,0], [size,0], [-size,0], [0,size], [0,-size], [size,size], [size,-size], [-size, size], [-size,-size]];
  var raycasters = [];
  for (var i = 0; i < diffs.length; i++) {
    raycasters.push(new THREE.Raycaster());
  }
  return {
    intersectObjects: function(objects, recursive) {
      var results = [];
      raycasters.forEach(function(raycaster) {
        results = results.concat(raycaster.intersectObjects(objects, recursive));
      });
      return results.unique();
    },

    setFromCamera: function(mouse, camera) {
      raycasters.forEach(function(raycaster, idx) {
        raycaster.setFromCamera({
          x: mouse.x + diffs[idx][0],
          y: mouse.y + diffs[idx][1]
        }, camera);
      });
    },

    raycasters: raycasters
  };
});
