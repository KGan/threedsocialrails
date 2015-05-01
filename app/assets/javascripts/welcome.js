define(['threedsocial', 'underscore', 'tour', 'webSocketRails', 'monkeys', 'renderer', 'jquery', 'bootstrap'], function(tds, _, Tour, WebSocketRails, monkeys, renderer, $){
  var init, animate, ifn, dispatcher, tour, tweetOptions = {};
  init = _.once(tds.init);
  animate = _.once(tds.animate.bind(tds));


  function startTweetStream(channel) {
    tweetChannel = dispatcher.subscribe(channel);
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
      monkeys.dispatch(tweet, tweetUrls);
    });
  }

  function initTweetStream() {
    if(dispatcher) dispatcher.trigger('connection_closed');
    dispatcher = new WebSocketRails('localhost:3000/websocket');

    dispatcher.trigger(
      'new',
      tweetOptions,
      function(response) {
        startTweetStream(response.channel_name);
      }
    );
  }

  function submitTags(e) {
    e.preventDefault();
    tweetOptions.tags = $('#tags').val();
    if(tweetOptions.tags.length < 1) return;
    $('#tweetsModal').modal('hide');
    initTweetStream();
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
      init();
      animate();
      tweetOptions.tags = 'Bae Bae';
      initTweetStream();
      gatherUserOptions();
    }
  };

});
