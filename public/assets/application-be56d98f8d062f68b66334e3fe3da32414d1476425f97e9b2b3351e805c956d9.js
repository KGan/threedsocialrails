


require.config({
  shim: {
    'threeCore': { exports: 'THREE' },
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'},
    'tween': { exports: 'TWEEN' },
    'webSocketRails': { exports: 'WebSocketRails'},
    'tour': { deps:['jquery'], exports: 'Tour'},
    'datGui': { exports: 'dat.GUI' },
    'jquery': { exports: '$' },
    'underscore': { exports: '_' },
    'bootstrap': { deps:['jquery'] }
  },

  paths: {
    'threeCore': 'three.min',
    'OrbitControls': 'OrbitControls',
    'tween': 'tween',
    'three': 'three',
    'threedsocial': 'threedsocial',
    'domReady': 'domReady',
    'webSocketRails': 'websocket_rails/main',
    'tour': 'bootstrap-tour',
    'bootstrap': 'bootstrap-sprockets',
    'underscore': 'underscore-min',
    'welcome': 'welcome',
    'datGui': 'dat.gui.min'
  }
});

require(['domReady', 'welcome'], function (domReady, welcome) {
  domReady(function () {
    welcome.welcome();
  });
});
