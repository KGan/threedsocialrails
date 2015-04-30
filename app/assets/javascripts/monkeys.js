define(['three', 'letters', 'scene', 'camera', 'flyingMonkey'],
  function (THREE, letters, scene, camera) {

  var flyingMonkeys = [],
    origin = new THREE.Vector3(0, 0, 0),
    letterSpace = 10,
    spaceSpace = 40,
    mouseX = 0, mouseY = 0,
    maxMonkeys = 75,
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
      deadMonkey = flyingMonkeys.shift();
      if (deadMonkey.userData.selected) {
        flyingMonkeys.push(deadMonkey);
        deadMonkey = flyingMonkeys.shift();
      }
      removeMonkey(deadMonkey, true);
    }
  }


  function removeMonkey (flyingMonkey, automaticRemove) {
    flyingMonkey.fade(1, 0, function () {
      flyingMonkey.userData.tween.stop();
      scene.remove(flyingMonkey);
    });
    if (!automaticRemove) {
      flyingMonkeys.splice(flyingMonkeys.indexOf(flyingMonkey), 1);
    }
  }

  return {
    remove: removeMonkey,

    dispatch: function (tweet, tweetUrls) {
      var flyingMonkey = createFlyingMonkey(tweet, tweetUrls);
      var entryAngle = Math.random() * 2 * Math.PI;
      var verticalAngle = (0.5 - Math.random()) * Math.PI * (3/4);
      flyingMonkey.position.copy(new THREE.Vector3(0, 0, -7000 - Math.random() * 1500))
        .applyAxisAngle(yaxis, entryAngle);
      var riseAxis = flyingMonkey.position.clone().cross(yaxis).normalize();
      flyingMonkey.position.applyAxisAngle(riseAxis, verticalAngle);
      flyingMonkey.wander();
      flyingMonkey.fade(0, 1, function () {
        flyingMonkey.eachGrandchild(function (letter) {
          letter.material = letters.material;
        });
      });
      flyingMonkey.lookAt(origin);
      scene.add(flyingMonkey);
      flyingMonkeys.push(flyingMonkey);
      checkMaxMonkeys();
    }
  };
});
