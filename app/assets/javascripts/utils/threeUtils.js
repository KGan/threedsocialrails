define (['threeCore'], function (THREE) {
  THREE.Group.prototype.eachGrandchild = function(callback) {
    this.children.forEach(function(child) {
      child.children.forEach(function(grandchild) {
        callback(grandchild);
      });
    });
  };

  THREE.Group.prototype.highlight = function(color) {
    this.eachGrandchild(function(letter) {
      letter.material.emissive = new THREE.Color(color);
    });
  };

  return THREE;
});
