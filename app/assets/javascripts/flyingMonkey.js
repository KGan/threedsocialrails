define(['three', 'letters', 'tween', 'raycaster', 'underscore'],
  function (THREE, letters, TWEEN, myRaycaster, _) {
  var highlightFade = 200, fadeTime = 450, origin = new THREE.Vector3(0, 0, 0);

  _.extend(THREE.Group.prototype, {
    highlight: function(color) {
      var highlightMaterial = letters.newMaterial();
      this.eachGrandchild(function(letter) {
        letter.material = highlightMaterial;
      });
      this.userData.fading = true;
      setTimeout(function () {
        this.userData.fading = false;
        highlightMaterial.emissive.set(color);
      }.bind(this), highlightFade);
      new TWEEN.Tween(highlightMaterial.emissive)
        .to({
          r: color.r,
          g: color.g,
          b: color.b
        }, highlightFade)
        .start();
    },

    dehighlight: function () {
      var highlightMaterial, i = -1;
      do {
        i++;
      } while (!this.children[0].children[i]);
      highlightMaterial = this.children[0].children[i].material;
      setTimeout(function () {
        this.eachGrandchild(function(letter) {
          letter.material = letters.material;
        });
      }.bind(this), highlightFade);

      new TWEEN.Tween(highlightMaterial.emissive)
        .to({
          r: 0,
          g: 0,
          b: 0
        }, highlightFade)
        .start();
    },

    fade: function (fromOpacity, toOpacity, callback) {
      var fadeMaterial = letters.newMaterial();
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
        x: mouse.x + this.userData.selectOffset.x,
        y: mouse.y + this.userData.selectOffset.y
      }, camera);
      this.position.copy(oneRaycaster.ray.direction)
        .multiplyScalar(this.userData.distance)
        .add(camera.position);
      if (!this.userData.fading) this.lookAt(origin);
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
