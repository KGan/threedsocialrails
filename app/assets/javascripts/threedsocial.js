define( ['three', 'tween', 'webSocketRails'], function (THREE, TWEEN, WebSocketRails) {
  THREE.Group.prototype.eachGrandchild = function(callback) {
    this.children.forEach(function(child) {
      child.children.forEach(function(grandchild) {
        callback(grandchild);
      });
    });
  };

  Object.defineProperty(Array.prototype, 'unique', {
    enumerable: false,
    value: function() {
      var o = {}, i, l = this.length, r = [];
      for(i=0; i<l;i+=1) o[this[i]] = this[i];
      for(i in o) r.push(o[i]);
      return r;
    }
  });

  this.jk = {};
  // if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  var container;

  var camera, scene1, scene2, renderer;

  var mouseX = 0, mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();


  function init() {


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: true } );

    //

    // camera = new THREE.PerspectiveCamera( 50, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 25000 );
    // camera.position.z = 0;

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 25000 );
    camera.position.z = 0;

    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );
    scene1 = new THREE.Scene();


    scene1.fog = new THREE.Fog( 0x9daaaa, .002, 100000);


    // scene1.add( new THREE.AmbientLight( 0xeef0ff ) );


    var light1 = new THREE.DirectionalLight( 0xffffff, .5 );
    light1.position.set( 10, 1, 1 );
    scene1.add( light1 );

    // new TWEEN.Tween (light1.position)
    // 	.to({x: 8000, y: 5000, z: -5000}, 5000)
    // 	.repeat(Infinity)
    // 	.yoyo(true)
    // 	.start();

    var light2 = new THREE.DirectionalLight( 0xffffff, .6 );
    light2.position.set( 5, 700, 1 );
    scene1.add( light2 );

    new TWEEN.Tween (light2.position)
      .to({x: 0, y: -700, z: 0}, 4000)
      .repeat(Infinity)
      .yoyo(true)
      .start();


    var light3 = new THREE.DirectionalLight( 0x999999, .6 );
    light3.position.set( 0, 800, 9000 );
    scene1.add( light3 );



    // Letters

    jk.textWidth = 50
    jk.textSize = 100
    jk.letterSpace = 10
    jk.spaceSpace = 40
    jk.letters = {}

    var chars = [].concat.apply( [], Array(94) )
          .map( function(_, i) {
            return String.fromCharCode(i+33)
          })
    jk.letterMaterial = new THREE.MeshPhongMaterial( {
      color: 0xaaaaff,
      shading: THREE.FlatShading,
      refractionRatio: 0.6,
      reflectivity: 0.2,
      specular: 0xffcccc,
      shininess: 20,
      transparent: true,
      opacity: 0
    });

  // 	jk.letterMaterial = new THREE.MeshBasicMaterial( {
  //       color: 0xccccff,
  //       refractionRatio: 0.6,
  // 			transparent: true,
  // 			opacity: 1
  // } );

    for(var i = 0; i < chars.length; i++) {
      letterGeo = new THREE.TextGeometry( chars[i], {
        size: jk.textSize,
        height: jk.textWidth,
        curveSegments: 3,
        font: "helvetiker",
        weight: "normal",
        style: "normal",
        material: 0,
        extrudeMaterial: 1
      });

      letterGeo.computeBoundingBox();
      letterGeo.computeVertexNormals();

      var centerOffset = -0.5 * ( letterGeo.boundingBox.max.x - letterGeo.boundingBox.min.x );
      jk.letters[chars[i]] = new THREE.Mesh( letterGeo, jk.letterMaterial );
    }


    //  TEXT

    jk.origin = new THREE.Vector3(0, 0, 0)
    jk.negativeZ = new THREE.Vector3(0,0,-1)
    jk.yaxis = new THREE.Vector3(0, 1, 0)
    jk.maxMonkeys = 100
    jk.flyingMonkeys = []

    camera.position.z = 4000

    flying_monkeys = 0
    meshes = {}

    var dispatcher = new WebSocketRails('localhost:3000/websocket');

    tweetChannel = dispatcher.subscribe('tweets')
    tweetChannel.bind('new', function(tweet) {
      var tweetUrls = /https?:\/\/t\.co\/\w{0,11}/g.exec(tweet.text)
      if(tweetUrls) {
        tweetUrls.forEach(function(tweetUrl) {
          tweet.text = tweet.text.replace(tweetUrl, '')
        })
      }
      tweet.text = tweet.text.replace('&amp;', '&');
      tweet.text = tweet.text.replace(/\n\s*\n/g, '\n');
      tweet.text = tweet.text.replace(/\n\s*\z/, '')
      dispatch_flying_monkey(tweet, tweetUrls);
    });

    create_flying_monkey = function (tweet, tweetUrls) {
      var tweetSplit = tweet.text.split("\n");
      var flying_monkey = new THREE.Group();
      flying_monkey.userData.tweetUrls = tweetUrls
      for (var i = 0; i < tweetSplit.length; i++) {
        monkey_piece = monkey_piece_factory(tweetSplit[i])
        monkey_piece.position.setY(- jk.textSize * i * 1.5)
        flying_monkey.add(monkey_piece)
      }
      monkeyAuthor = monkey_piece_factory(tweet.author)
      monkeyAuthor.position.setY(- jk.textSize * i * 1.5);
      monkeyAuthor.position.setX(jk.textSize * 3);
      // monkeyAuthor.scale.copy(new THREE.Vector3(0.8, 0.8, 0.8));

      monkeyAuthor.children.forEach(function(letter) {
        letter.material.color = new THREE.Color(0xaad5ff);
      });
      flying_monkey.add(monkeyAuthor);
      return flying_monkey;
    }

    monkey_piece_factory = function (tweetline) {
      monkey_piece = new THREE.Group()
      var pos = 0
      tweetline.split("").forEach( function (tweetletter) {
        if (tweetletter == " ") {
          pos += jk.spaceSpace
        } else {
          if (jk.letters[tweetletter]) {
            new_letter = jk.letters[tweetletter].clone()
            new_letter.material = jk.letterMaterial;
            new_letter.position.x = pos
            pos += new_letter.geometry.boundingBox.max.x + jk.letterSpace
            monkey_piece.add(new_letter)
          } else {
            // console.log("can't yet read: " + tweetletter)
          }
        }
      })
      return monkey_piece
    }



    dispatch_flying_monkey = function (tweet, tweetUrls) {
      var flyingMonkey = create_flying_monkey(tweet, tweetUrls)
      var entryAngle = Math.random() * 2 * Math.PI
      var verticalAngle = (0.5 - Math.random()) * Math.PI * (3/4)
      flyingMonkey.position.copy(new THREE.Vector3(0, 0, -7000 - Math.random() * 1500))
      flyingMonkey.position.applyAxisAngle( jk.yaxis, entryAngle )
      var riseAxis = flyingMonkey.position.clone().cross(jk.yaxis).normalize()
      flyingMonkey.position.applyAxisAngle(riseAxis, verticalAngle)
      moveTween(flyingMonkey)
      flyingMonkey.lookAt( jk.origin )
      scene1.add(flyingMonkey)
      jk.flyingMonkeys.push(flyingMonkey)
      checkMaxMonkeys();
    }

    checkMaxMonkeys = function () {
      if (jk.flyingMonkeys.length > jk.maxMonkeys) {
        var deadMonkey = jk.flyingMonkeys.shift();
        removeMonkey(deadMonkey);
      }
    }

    moveTween = function(flyingMonkey) {
      var startpos = flyingMonkey.position
      var time = Math.random() * 10000 + 25000
      flyingMonkey.userData.tween = new TWEEN.Tween(flyingMonkey.position)
        .to( {x: 2 * startpos.x / 3, y: startpos.y + ( Math.random() - 0.5) * 4000, z: startpos.z + Math.random() * 2000}, 5000 + time)
        .onComplete(function() {
          removeMonkey(flyingMonkey)
        })
        .start();
      flyingMonkey.eachGrandchild(function(letter) {
        new TWEEN.Tween(letter.material).to( {opacity: 1}, 500 ).start()
      })
    }

    removeMonkey = function(flyingMonkey) {
      flyingMonkey.userData.tween.stop();
      scene1.remove(flyingMonkey)
    }
    //



    // RENDERER

    renderer.setClearColor( scene1.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.autoClear = false;

    renderer.domElement.style.position = "relative";
    container.appendChild( renderer.domElement );

    jk.myRaycaster = function() {
      var size = 0.03
      var diffs = [[0,0], [size,0], [-size,0], [0,size], [0,-size], [size,size], [size,-size], [-size, size], [-size,-size]]
      var raycasters = []
      for (var i = 0; i < diffs.length; i++) {
        raycasters.push(new THREE.Raycaster());
      }
      return {
        intersectObjects: function(objects, recursive) {
          var results = [];
          raycasters.forEach(function(raycaster) {
            results = results.concat(raycaster.intersectObjects(objects, recursive))
          })
          return results.unique()
          // return results
        },

        setFromCamera: function(mouse, camera) {
          raycasters.forEach(function(raycaster, idx) {
            raycaster.setFromCamera({
              x: mouse.x + diffs[idx][0],
              y: mouse.y + diffs[idx][1]
            }, camera);
          })
        },

        raycasters: raycasters
      }
    }()
  }

  function fetch_monkey_image(url) {
  // TODO  talk to the socket
  }


  function animate() {

    requestAnimationFrame( animate );
    TWEEN.update();
    render();
    // stats.update();
  }


  function render() {

    renderer.clear();
    renderer.render( scene1, camera );
  }
})
