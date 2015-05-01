define( ['three', 'tween', 'webSocketRails', 'renderer', 'camera', 'controls', 'scene', 'monkeys', 'raycaster', 'underscore', 'lights', 'jquery'],
  function (THREE, TWEEN, WebSocketRails, renderer, camera, controls, scene, monkeys, myRaycaster) {

  var dispatcher, tweetUrls, selectedMonkey, mouse, intersects, pointedMonkeys,
    distances, tween, urls, upperCorner,
    mouseDownTime = 0,
    highlightColor = new THREE.Color(0xf0c96e);

  return {
    init: function () {
      camera.position.z = 4000;

      $('.threedsocial').on( 'mousedown', onMouseDown);

      function setMouse(event) {
        mouse = {};
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        return mouse;
      }

      function onMouseDown( event ) {
        // this.zoomIn();
        mouse = setMouse(event);

        myRaycaster.setFromCamera(mouse, camera);
        intersects = myRaycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

          selectIntersection(intersects, mouse);
          if (event.button === 2) {
            monkeys.remove(selectedMonkey);
            selectedMonkey = null;
          } else if (Date.now() - mouseDownTime < 500) {
            openWindow();
            monkeys.remove(selectedMonkey);
            selectedMonkey = null;
          } else {
            mouseDownTime = Date.now();
          }
        } else {
          controls.orbitStart(event);
        }
        $('.threedsocial').on('mousemove', onMouseMove);
        $('.threedsocial').on('mouseup', onMouseUp);
      }

      function onMouseMove( event ) {
        if (selectedMonkey) {
          selectedMonkey.move(setMouse(event));
        } else {
          controls.orbitCamera(event);
        }
      }

      function selectIntersection(intersects, mouse) {
        pointedMonkeys = _.uniq(intersects.map(function (intersect) {
          return intersect.object.parent.parent;
        }));
        distances = pointedMonkeys.map(function (monkey) {
          return monkey.position.distanceTo( camera.position );
        });
        selectedMonkey = pointedMonkeys[distances.indexOf(Math.min.apply(null, distances))];
        selectedMonkey.highlight(highlightColor);
        upperCorner = selectedMonkey.position.clone().project(camera);
        _.extend(selectedMonkey.userData, {
          selectOffset: {
            x: upperCorner.x - mouse.x,
            y: upperCorner.y - mouse.y
          },
          distance: selectedMonkey.position.distanceTo(camera.position),
          selected: true
        });
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

        $('.threedsocial').off('mousemove');
        $('.threedsocial').off('mouseup');

        controls.resetState();
      }
    },


    animate: function () {
      requestAnimationFrame(this.animate.bind(this));
      TWEEN.update();
      renderer.clear();
      renderer.render(scene, camera);
    },

    zoomIn: function () {
      controls.setRadius = 100000;
      new TWEEN.Tween(controls)
        .to({ setRadius: 500, setTheta: 15 }, 8000)
        .onUpdate(function() {
          controls.update();
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      controls.setPhi = 1;
      new TWEEN.Tween(controls)
        .to({ setPhi: 2 }, 1500)
        .repeat(2)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .start();
    }
  };
});



//    .1 * y = 2.    when x = 0, y = 1, when x = 1, y = 20  20 * x
