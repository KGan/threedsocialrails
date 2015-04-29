define( ['three', 'tween', 'webSocketRails', 'renderer', 'camera', 'controls', 'scene', 'monkeys', 'raycaster', 'utils/unique'],
  function (THREE, TWEEN, WebSocketRails, renderer, camera, controls, scene, monkeys, myRaycaster) {

  var dispatcher, tweetUrls, selectedMonkey, mouse, intersects, pointedMonkeys,
    distances, tween, urls, mouseDownTime = 0,
    highlightColor = new THREE.Color(0xf0c96e);

  return {
    init: function () {
      camera.position.z = 4000;

      dispatcher = new WebSocketRails('localhost:3000/websocket');

      tweetChannel = dispatcher.subscribe('tweets');
      tweetChannel.bind('new', function(tweet) {
        tweetUrls = /https?:\/\/t\.co\/\w{0,11}/g.exec(tweet.text);
        if(tweetUrls) {
          tweetUrls.forEach(function(tweetUrl) {
            tweet.text = tweet.text.replace(tweetUrl, '');
          });
        }
        tweet.text = tweet.text.replace('&amp;', '&');
        tweet.text = tweet.text.replace(/\n\s*\n/g, '\n');
        tweet.text = tweet.text.replace(/\n\s*\z/, '');
        monkeys.dispatch(tweet, tweetUrls);
      });

      document.addEventListener( 'mousedown', onMouseDown, false );

      function setMouse(event) {
        mouse = {};
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        return mouse;
      }

      function onMouseDown( event ) {
        mouse = setMouse(event);
        event.preventDefault();
        myRaycaster.setFromCamera(mouse, camera);
        intersects = myRaycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          selectIntersection(intersects);
          if (Date.now() - mouseDownTime < 500) {
            openWindow();
          } else {
            mouseDownTime = Date.now();
          }
        } else {
          controls.orbitStart(event);
        }

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
      }

      function onMouseMove( event ) {
        if (selectedMonkey) {
          selectedMonkey.move(setMouse(event));
        } else {
          controls.orbitCamera(event);
        }
      }

      function selectIntersection(intersects) {
        console.log(intersects);
        pointedMonkeys = intersects.map(function (intersect) {
          return intersect.object.parent.parent;
        }).unique();
        distances = pointedMonkeys.map(function (monkey) {
          return monkey.position.distanceTo( camera.position );
        });
        selectedMonkey = pointedMonkeys[distances.indexOf(Math.min.apply(null, distances))];
        selectedMonkey.highlight(highlightColor);
        selectedMonkey.userData.distance = selectedMonkey.position.distanceTo(camera.position);
        selectedMonkey.userData.selected = true;
        tween = selectedMonkey.userData.tween;
        if (tween) {
          tween.stop();
        }
      }

      function openWindow() {
        urls = selectedMonkey.userData.tweetUrls;
        if (urls) {
          urls.forEach(function(tweetUrl){
            window.open(tweetUrl);
            window.focus();
          });
        }
        monkeys.remove(selectedMonkey);
      }


      function onMouseUp () {
        if (selectedMonkey) {
          selectedMonkey.dehighlight();
          selectedMonkey.userData.selected = false;
          selectedMonkey.wander();
          selectedMonkey = null;
        }

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        controls.resetState();
      }
    },

    animate: function () {
      requestAnimationFrame(this.animate.bind(this));
      TWEEN.update();
      renderer.clear();
      renderer.render(scene, camera);
    }
  };
});
