define(['three', 'letters', 'scene'], function (THREE, letters, scene) {
  create_flying_monkey = function (tweet, tweetUrls) {
    var tweetSplit = tweet.text.split("\n");
    var flying_monkey = new THREE.Group();
    flying_monkey.userData.tweetUrls = tweetUrls;
    for (var i = 0; i < tweetSplit.length; i++) {
      monkey_piece = monkey_piece_factory(tweetSplit[i]);
      monkey_piece.position.setY(- tds.textSize * i * 1.5);
      flying_monkey.add(monkey_piece);
    }
    monkeyAuthor = monkey_piece_factory(tweet.author);
    monkeyAuthor.position.setY(- tds.textSize * i * 1.5);
    monkeyAuthor.position.setX(tds.textSize * 3);
    // monkeyAuthor.scale.copy(new THREE.Vector3(0.8, 0.8, 0.8));

    monkeyAuthor.children.forEach(function(letter) {
      letter.material.color = new THREE.Color(0xaad5ff);
    });
    flying_monkey.add(monkeyAuthor);
    return flying_monkey;
  };

  monkey_piece_factory = function (tweetline) {
    monkey_piece = new THREE.Group();
    var pos = 0;
    tweetline.split("").forEach( function (tweetletter) {
      if (tweetletter == " ") {
        pos += tds.spaceSpace;
      } else {
        if (letters[tweetletter]) {
          new_letter = letters[tweetletter].clone();
          new_letter.material = tds.letterMaterial;
          new_letter.position.x = pos;
          pos += new_letter.geometry.boundingBox.max.x + tds.letterSpace;
          monkey_piece.add(new_letter);
        } else {
          // console.log("can't yet read: " + tweetletter)
        }
      }
    });
    return monkey_piece;
  };


  checkMaxMonkeys = function () {
    if (tds.flyingMonkeys.length > tds.maxMonkeys) {
      var deadMonkey = tds.flyingMonkeys.shift();
      removeMonkey(deadMonkey);
    }
  };

  moveTween = function(flyingMonkey) {
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
  };

  return {
    remove: function(flyingMonkey) {
      flyingMonkey.userData.tween.stop();
      scene.remove(flyingMonkey);
    },

    dispatch: function (tweet, tweetUrls) {
      var flyingMonkey = create_flying_monkey(tweet, tweetUrls);
      var entryAngle = Math.random() * 2 * Math.PI;
      var verticalAngle = (0.5 - Math.random()) * Math.PI * (3/4);
      flyingMonkey.position.copy(new THREE.Vector3(0, 0, -7000 - Math.random() * 1500));
      flyingMonkey.position.applyAxisAngle( tds.yaxis, entryAngle );
      var riseAxis = flyingMonkey.position.clone().cross(tds.yaxis).normalize();
      flyingMonkey.position.applyAxisAngle(riseAxis, verticalAngle);
      moveTween(flyingMonkey);
      flyingMonkey.lookAt( tds.origin );
      scene.add(flyingMonkey);
      tds.flyingMonkeys.push(flyingMonkey);
      checkMaxMonkeys();
    }
  };
});
