define (['three'], function (THREE) {
  THREE.Group.prototype.eachGrandchild = function(callback) {
    this.children.forEach(function(child) {
      child.children.forEach(function(grandchild) {
        callback(grandchild);
      });
    });
  };
  return THREE;
});
