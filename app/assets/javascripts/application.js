require.config({
  shim: {
    'threeCore': { exports: 'THREE' },
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'},
    'tween': { exports: 'TWEEN' },
    'webSocketRails': { exports: 'WebSocketRails'},
    'underscore': { expors: '_' }
  },

  paths: {
    'threeCore': 'three.min',
    'OrbitControls': 'OrbitControls',
    'tween': 'tween',
    'three': 'three',
    'threedsocial': 'threedsocial',
    'domReady': 'domReady',
    'webSocketRails': 'websocket_rails/main'
  }
});

require(['domReady', 'threedsocial'], function (domReady, tds) {
  domReady(function () {
    tds.init();
    tds.animate();
    tds.zoomIn();
  });
});
