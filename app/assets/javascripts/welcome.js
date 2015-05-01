define(['threedsocial', 'underscore', 'tour', 'webSocketRails', 'monkeys', 'renderer', 'jquery'],
function(tds, _, Tour, WebSocketRails, monkeys, renderer, $){
  var init, animate, ifn, dispatcher, tour, tweetOptions = {};
  init = _.once(tds.init);
  animate = _.once(tds.animate.bind(tds));

  function submitTags(e) {
    e.preventDefault();
    tweetOptions.tags = $('#tags').val();
    $('#tweetsModal').modal('hide');
    tds.initTweetStream();
  }

  function gatherUserOptions() {
    $('#tweetsModal').modal('show');
    $('#tweetsModal form').on('submit', ifn);
    tour = new Tour({
      steps: [
        {//step 1
          title: 'Welcome to 3dSocial!',
          content: "This app streams twitter feeds of your choice to a 3d world.",
          orphan: true,
        },
        {//step 2
          element: '#tweetsModal',
          title: 'Choose some tags',
          content: "Type in some comma delimited tags, no hashtags needed.\nWe've filled in the top 10 trending worldwide for you as suggestions",
          placement: 'bottom'
        },
        {//step 3
          title: '3dSocial',
          content: "Tweets will stream in. Click to drag them around \nDouble-click to open linked article in the tweet\nDrag in open space to move the camera",
          orphan: true,
        }
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
