define(['three', 'letters', 'scene', 'raycaster', 'tween', 'camera'],
  function (THREE, letters, scene, myRaycaster, TWEEN, camera) {
  var flyingMonkeys = [],
    origin = new THREE.Vector3(0, 0, 0),
    letterSpace = 10,
    spaceSpace = 40,
    mouseX = 0, mouseY = 0,
    maxMonkeys = 100,
    basicMonkeyColor = new THREE.Color(0xaad5ff),
    yaxis = new THREE.Vector3(0, 1, 0);


  function createFlyingMonkey (tweet, tweetUrls) {
    var tweetSplit = tweet.text.split("\n");
    var flyingMonkey = new THREE.Group();
    flyingMonkey.userData.tweetUrls = tweetUrls;
    for (var i = 0; i < tweetSplit.length; i++) {
      monkeyPiece = monkeyPieceFactory(tweetSplit[i]);
      monkeyPiece.position.setY(- letters.textSize * i * 1.5);
      flyingMonkey.add(monkeyPiece);
    }
    monkeyAuthor = monkeyPieceFactory(tweet.author);
    monkeyAuthor.position.setY(- letters.textSize * i * 1.5);
    monkeyAuthor.position.setX(letters.textSize * 3);
    // monkeyAuthor.scale.copy(new THREE.Vector3(0.8, 0.8, 0.8));

    monkeyAuthor.children.forEach(function(letter) {
      letter.material.color = basicMonkeyColor;
    });
    flyingMonkey.add(monkeyAuthor);
    return flyingMonkey;
  }

  function monkeyPieceFactory (tweetline) {
    monkeyPiece = new THREE.Group();
    var pos = 0;
    tweetline.split("").forEach( function (tweetletter) {
      if (tweetletter == " ") {
        pos += spaceSpace;
      } else {
        if (letters[tweetletter]) {
          new_letter = letters[tweetletter].clone();
          new_letter.material = letters.material;
          new_letter.position.x = pos;
          pos += new_letter.geometry.boundingBox.max.x + letterSpace;
          monkeyPiece.add(new_letter);
        } else {
          // console.log("can't yet read: " + tweetletter)
        }
      }
    });
    return monkeyPiece;
  }


  function checkMaxMonkeys () {
    if (flyingMonkeys.length > maxMonkeys) {
      var deadMonkey = flyingMonkeys.shift();
      removeMonkey(deadMonkey);
    }
  }

  function monkeyWander (flyingMonkey) {
    var startpos = flyingMonkey.position;
    var time = Math.random() * 10000 + 25000;
    flyingMonkey.userData.tween = new TWEEN.Tween(flyingMonkey.position)
      .to( {x: 2 * startpos.x / 3, y: startpos.y + ( Math.random() - 0.5) * 4000, z: startpos.z + Math.random() * 2000}, 5000 + time)
      .onComplete(function() {
        removeMonkey(flyingMonkey);
      })
      .start();
    flyingMonkey.eachGrandchild(function(letter) {
      new TWEEN.Tween(letter.material).to( {opacity: 1}, 500 ).start();
    });
  }

  function removeMonkey (flyingMonkey) {
    flyingMonkey.userData.tween.stop();
    scene.remove(flyingMonkey);
  }

  return {
    remove: removeMonkey,
    wander: monkeyWander,

    dispatch: function (tweet, tweetUrls) {
      var flyingMonkey = createFlyingMonkey(tweet, tweetUrls);
      var entryAngle = Math.random() * 2 * Math.PI;
      var verticalAngle = (0.5 - Math.random()) * Math.PI * (3/4);
      flyingMonkey.position.copy(new THREE.Vector3(0, 0, -7000 - Math.random() * 1500))
        .applyAxisAngle(yaxis, entryAngle);
      var riseAxis = flyingMonkey.position.clone().cross(yaxis).normalize();
      flyingMonkey.position.applyAxisAngle(riseAxis, verticalAngle);
      monkeyWander(flyingMonkey);
      flyingMonkey.lookAt(origin);
      scene.add(flyingMonkey);
      flyingMonkeys.push(flyingMonkey);
      checkMaxMonkeys();
    },

    move: function (selectedMonkey, mouse) {
      var oneRaycaster = myRaycaster.raycasters[1];
      oneRaycaster.setFromCamera(mouse, camera);
      selectedMonkey.position.copy(oneRaycaster.ray.direction)
        .multiplyScalar(selectedMonkey.userData.distance)
        .add(camera.position);
      selectedMonkey.lookAt(origin);
    }
  };
});
