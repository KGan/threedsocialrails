define(['threedsocial', 'underscore', 'tour', 'webSocketRails', 'monkeys', 'renderer', 'jquery', 'bootstrap'],
function(tds, _, Tour, WebSocketRails, monkeys, renderer, $){
  var init, animate, ifn, dispatcher, tour, tweetOptions = {};
  init = _.once(tds.init);
  animate = _.once(tds.animate.bind(tds));

  function submitTags(e) {
    e.preventDefault();
    tweetOptions.tags = $('#tags').val().replace(/#/g, '');
    if(tweetOptions.tags.length < 1) return;
    $('#tweetsModal').modal('hide');
    tds.initTweetStream(tweetOptions);
  }

  function gatherUserOptions() {
    $('#tweetsModal').modal('show');
    $('#tweetsModal').on('bs.modal.shown', function(){});
    $('#tweetsModal form').on('submit', submitTags);
    tour = new Tour({
      steps: [
        {//step 1
          element: '#tags',
          backdropPadding: { bottom: '-50px'},
          title: 'Welcome to The Twittersphere!',
          content: "This app streams twitter trends of your choice to a 3d world.",
          placement: 'top',
          orphan: true
        },
        {//step 2
          element: '#tags',
          title: 'Choose some tags',
          content: "Type the tags you want to follow, separated by commas.",
          placement: 'top'
        },
        
      ],
    });
    tour.init();
    tour.start();

  }

  return {
    welcome: function() {
      gatherUserOptions();
      init();
      animate();
    }
  };
});
