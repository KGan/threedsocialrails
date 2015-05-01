define(['three', 'jquery'], function (THREE, $) {
  var container = document.createElement( 'div' );
  $(container).addClass('threedsocial');
   document.body.appendChild( container );

  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // renderer.setClearColor( new THREE.Color(0x9daaaa, 0));
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  renderer.autoClear = false;

  renderer.domElement.style.position = "relative";
  container.appendChild( renderer.domElement );

  // var canvas = $('<canvas>');
  // var ctx = canvas.get(0).getContext('2d');
  // ctx.imageSmoothingEnabled = false;
  // ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
  // $('body').append(canvas);

  // var img = new Image(), play = true;
  // img.onload = animPixelate;
  // img.src = '';
  function animPixelate(){
    var v = 25, dx = 0.25;
    anim();

    function anim() {
      v += dx;
      if( 5 <= v || 25 >= v ) dx = -dx;
      pixelate(v);
      if( play ) requestAnimationFrame(anim);
    }
  }
  function pixelate(w) {
    var size = w * 0.01 + 0.01;
    var fX =  canvas.width * size;
    var fY = canvas.height * size;

    ctx.drawImage(img, 0, 0, fX, fY);

    ctx.drawImage(canvas, 0, 0, fX, fY, 0, 0, canvas.width, canvas.height);
  }

  function fadeCanvas() {
    canvas.addClass('faded');
    canvas.on('transitionend', function(){
      play = false;
      canvas.detach();
    });
  }
  function bringContainerToFront() {
    $(container).removeClass('backgrounded');
  }


  return renderer;
});
