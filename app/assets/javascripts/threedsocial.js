define( ['three', 'tween', 'webSocketRails', 'renderer', 'camera', 'scene', 'letters', 'raycaster'],
  function (THREE, TWEEN, WebSocketRails, renderer, camera, scene, letters, myRaycaster) {




  return {
    init: function () {

      var letterSpace = 10;
      var spaceSpace = 40;
      var mouseX = 0, mouseY = 0;
      var origin = new THREE.Vector3(0, 0, 0);
      var negativeZ = new THREE.Vector3(0,0,-1);
      var yaxis = new THREE.Vector3(0, 1, 0);
      var maxMonkeys = 100;
      var flyingMonkeys = [];

      camera.position.z = 4000;

      flying_monkeys = 0;

      var dispatcher = new WebSocketRails('localhost:3000/websocket');

      tweetChannel = dispatcher.subscribe('tweets');
      tweetChannel.bind('new', function(tweet) {
        var tweetUrls = /https?:\/\/t\.co\/\w{0,11}/g.exec(tweet.text);
        if(tweetUrls) {
          tweetUrls.forEach(function(tweetUrl) {
            tweet.text = tweet.text.replace(tweetUrl, '');
          });
        }
        tweet.text = tweet.text.replace('&amp;', '&');
        tweet.text = tweet.text.replace(/\n\s*\n/g, '\n');
        tweet.text = tweet.text.replace(/\n\s*\z/, '');
        dispatch_flying_monkey(tweet, tweetUrls);
      });

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



      dispatch_flying_monkey = function (tweet, tweetUrls) {
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

      removeMonkey = function(flyingMonkey) {
        flyingMonkey.userData.tween.stop();
        scene.remove(flyingMonkey);
      };






      function setMouse(event) {
        var mouse = {};
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        return mouse;
      }

      document.addEventListener( 'mousedown', onMouseDown, false );

      function onMouseDown( event ) {
        var mouse = setMouse(event);
        event.preventDefault();

        myRaycaster.setFromCamera( mouse, camera );

        var intersects = myRaycaster.intersectObjects( scene.children, true );

        if (intersects.length > 0) {
          selectIntersection(intersects);
          if (Date.now() - tds.mouseDownTime < 500) {
            openWindow()
          } else {
            tds.mouseDownTime = Date.now()
          }
        } else {
          controls.orbitStart(event);
        }

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
      };

      function onMouseMove( event ) {
        if (tds.selectedMonkey) {
          moveMonkey(event)
        } else {
          controls.orbitCamera(event)
        }
      }

      function selectIntersection(intersects) {
        console.log(intersects);
        var pointedMonkeys = intersects.map(function (intersect) {
          return intersect.object.parent.parent;
        }).unique();
        var distances = pointedMonkeys.map(function (monkey) {
          return monkey.position.distanceTo( scope.object.position );
        });
        jk.selectedMonkey = pointedMonkeys[distances.indexOf(Math.min.apply(null, distances))];
        jk.selectedMonkey.highlight(0xf0c96e);
        jk.selectedMonkey.userData.distance = jk.selectedMonkey.position.distanceTo(scope.object.position);
        var tween = jk.selectedMonkey.userData.tween
        if (tween) {
          tween.stop();
        }
      }

      function openWindow() {
        var urls = jk.selectedMonkey.userData.tweetUrls;
        if (urls) {
          urls.forEach(function(tweetUrl){
            window.open(tweetUrl);
            window.focus();
          });
        }
        removeMonkey(jk.selectedMonkey);
      }


      function onMouseUp () {

        if (tds.selectedMonkey) {
          tds.selectedMonkey.highlight(0x000000)
          moveTween(tds.selectedMonkey)
          tds.selectedMonkey = null
        }


        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );

        controls.resetState();
      }

      function moveMonkey (event) {
        var mouse = setMouse(event);
        myRaycaster.raycasters[1].setFromCamera( mouse, scope.object );
        tds.selectedMonkey.position.copy(myRaycaster.raycasters[1].ray.direction);
        tds.selectedMonkey.position.multiplyScalar(tds.selectedMonkey.userData.distance);
        tds.selectedMonkey.position.add(scope.object.position);
        tds.selectedMonkey.lookAt(tds.origin)
      }
    },

    animate: function () {
      requestAnimationFrame( animate );
      TWEEN.update();
      renderer.clear();
      renderer.render( scene, camera );
    }
  }
})
