define(['three', 'letters', 'tween', 'raycaster', 'utils/utils'],
  function (THREE, letters, TWEEN, myRaycaster, utils) {
  var highlightFade = 200, fadeTime = 450, origin = new THREE.Vector3(0, 0, 0);

  utils.extend(THREE.Group.prototype, {
    highlight: function(color) {
      var highlightMaterial = letters.newMaterial();
      this.eachGrandchild(function(letter) {
        letter.material = highlightMaterial;
      });
      new TWEEN.Tween(highlightMaterial.emissive)
        .to({
          r: color.r,
          g: color.g,
          b: color.b
        }, highlightFade)
        .start();
    },

    dehighlight: function () {
      var highlightMaterial = this.children[0].children[0].material;
      new TWEEN.Tween(highlightMaterial.emissive)
        .to({
          r: 0,
          g: 0,
          b: 0
        }, highlightFade)
        .onComplete(function () {
          this.eachGrandchild(function(letter) {
            letter.material = letters.material;
          });
        }.bind(this))
        .start();
    },

    fade: function (fromOpacity, toOpacity, callback) {
      fadeMaterial = letters.newMaterial();
      fadeMaterial.opacity = fromOpacity;
      this.eachGrandchild(function (letter) {
        letter.material = fadeMaterial;
      });
      new TWEEN.Tween(fadeMaterial)
        .to({ opacity: toOpacity }, fadeTime)
        .onComplete(function () {
          callback();
        })
        .start();
    },

    move: function (mouse) {
      var oneRaycaster = myRaycaster.raycasters[1];
      oneRaycaster.setFromCamera({
        x: mouse.x + this.selectOffset.x,
        y: mouse.y + this.selectOffset.y
      }, camera);
      this.position.copy(oneRaycaster.ray.direction)
        .multiplyScalar(this.userData.distance)
        .add(camera.position);
      this.lookAt(origin);
    },

    wander: function () {
      var startpos = this.position;
      var time = Math.random() * 10000 + 25000;
      this.userData.tween = new TWEEN.Tween(this.position)
        .to( {x: 2 * startpos.x / 3, y: startpos.y + ( Math.random() - 0.5) * 4000, z: startpos.z + Math.random() * 2000}, 5000 + time)
        .repeat(Infinity)
        .yoyo(true)
        .start();
    }
  });
});
