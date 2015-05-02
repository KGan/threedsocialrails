class TweetsController < WebsocketRails::BaseController
  include ActionView::Helpers::TextHelper
  $LINE_WIDTH = 30
  def start_new
    # trigger_failure
    begin
      fetch_fifty(message["tags"])
    rescue Twitter::Error => e
      failed_error = {
        "message" => e.message
      }
    end
    # Thread.abort_on_exception = true
    controller_store[:uids] ||= []
    channel_id = 0
    while controller_store[:uids].include?(channel_id)
      channel_id += 1
    end
    controller_store[:uids] << channel_id
    connection_store[:thread] = Thread.new(channel_id, message["tags"]) do |cid, tags|
      begin
        Thread.current[:client] = Twitter::Streaming::Client.new do |config|
          config.consumer_key        = Figaro.env.twitter_consumer_key
          config.consumer_secret     = Figaro.env.twitter_consumer_secret
          config.access_token        = Figaro.env.twitter_access_token
          config.access_token_secret = Figaro.env.twitter_access_secret
        end

        Thread.current[:client].filter(track: tags) do |object|
          Thread.current[:tweet] = extract_tweet(object)
          WebsocketRails["tweets_#{cid}"].trigger 'new', Thread.current[:tweet]
        end
      rescue Twitter::Error => e
        WebsocketRails["tweets_#{cid}"].trigger 'streaming_error', {message: e.message}
      end
    end
    trigger_success({:channel_name => "tweets_#{channel_id}", :tweets => @tweets, :failed => failed_error})
  end

  def disconnect
    connection_store[:thread].exit
    controller_store[:uids] -= [channel_id]
  end

  def fetch_fifty(query)
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = Figaro.env.twitter_consumer_key
        config.consumer_secret     = Figaro.env.twitter_consumer_secret
        config.access_token        = Figaro.env.twitter_access_token
        config.access_token_secret = Figaro.env.twitter_access_secret
    end
    query_terms = query.split(',').map(&:strip)
    results_per_term = 50 / query_terms.length
    @tweets = []
    query_terms.each do |qt|
      @tweets.concat(client.search("##{qt} -rt",:count => results_per_term, :result_type => 'recent').take(results_per_term).map do |tweet|
        extract_tweet(tweet)
      end )
    end

  end

  private
    def extract_tweet(tweet)
      {}.tap do |tweet_obj|
        tweet_obj[:text] = word_wrap(tweet.text, line_width: $LINE_WIDTH)
        tweet_obj[:author] = '@' + tweet.attrs[:user][:screen_name]
        puts tweet_obj
      end
    end
end
