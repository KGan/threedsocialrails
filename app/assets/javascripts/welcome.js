define(['threedsocial', 'underscore', 'tour', 'webSocketRails', 'monkeys', 'datGui' ], function(tds, _, Tour, WebSocketRails, monkeys, GUI){
  var init, animate, ifn, dispatcher, gui, tour, tweetOptions;
  init = _.once(tds.init);
  animate = _.once(tds.animate.bind(tds));


  function startTweetStream(channel) {
    tweetChannel = dispatcher.subscribe(channel);
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
      monkeys.dispatch(tweet, tweetUrls);
    });
  }

  function initTweetStream() {
    init();
    animate();
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

  function customDebounce(fn, wait, otherwise, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if ( !immediate ) fn.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        fn.apply(context, args);
      } else {
        if (otherwise && timeout) otherwise();
      }
    }
  }

  function TweetOpts() {
    // this.message = 'Enter some tags separated by commas';
    this.tags = '';
    this.Go = ifn;
  }

  function gatherUserOptions() {
    ifn = customDebounce(initTweetStream, 5000, function(){ alert('You must wait 5 seconds between changing tags')}, true);
    tweetOptions = new TweetOpts();
    gui = new GUI({
      //autoPlace:false,
        width: '90%',
    });
    // gui.add(tweetOptions, 'message');
    gui.add(tweetOptions, 'tags');
    gui.add(tweetOptions, 'Go');
    tour = new Tour({
      steps: [
        {//step 1
          title: 'Welcome to 3dSocial!',
          content: "This app streams twitter feeds of your choice to a 3d world.",
          orphan: true,
          backdrop: true
        },
        {//step 2
          element: '.dg.main',
          title: 'Choose some tags',
          content: 'Type in some comma delimited tags, no hashtags needed. eg "Kardashian GreysAnatomy EarthDay" ',
          backdrop: true,
          placement: 'bottom'
        },
        {//step 3
          title: '3dSocial',
          content: "Streams will come in. Click to drag them around, double-click to open linked article in the tweet. Drag in open space to move the camera (orbit controls)",
          orphan: true,
          backdrop: true
        }
      ],

    });
    tour.init();
    tour.start();
  }
  return {
    welcome: function() {
      gatherUserOptions();
    }
  }

});
