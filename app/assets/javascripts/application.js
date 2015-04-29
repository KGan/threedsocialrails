// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.

require.config({
  shim: {
    'threeCore': { exports: 'THREE' },
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'},
    'tween': { exports: 'TWEEN' },
    'webSocketRails': { exports: 'WebSocketRails'},
    'tour': { deps:['jquery'], exports: 'Tour'},
    'datGui': { exports: 'dat.GUI' },
    'jquery': { exports: '$' },
    'underscore': { exports: '_' }
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
