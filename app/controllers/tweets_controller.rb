class TweetsController < WebsocketRails::BaseController
  include ActionView::Helpers::TextHelper
  $LINE_WIDTH = 30
  def start_new
    fetch_fifty(message["tags"])
    Thread.abort_on_exception = true
    controller_store[:uids] ||= []
    channel_id = 0
    while controller_store[:uids].include?(channel_id)
      channel_id += 1
    end
    controller_store[:uids] << channel_id
    connection_store[:thread] = Thread.new(channel_id, message["tags"]) do |cid, tags|
      Thread.current[:client] = Twitter::Streaming::Client.new do |config|
        config.consumer_key        = "0X4UNFV7P3RzUDWlly7fgD1Cx"
        config.consumer_secret     = "3QSn43Vl505x1TbClrfEz7JciF6dOtrHhBH0X9CwfX6Ofzby6u"
        config.access_token        = "2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4"
        config.access_token_secret = "zNXDFeQZrm3uEkMabpD5KyTYPTqdMn65iGT2eJixU8omP"
      end

      Thread.current[:client].filter(track: tags) do |object|
        Thread.current[:tweet] = extract_tweet(object)
        WebsocketRails["tweets_#{cid}"].trigger 'new', Thread.current[:tweet]
      end
    end
    debugger
    trigger_success({:channel_name => "tweets_#{channel_id}", :tweets => @tweets})
  end

  def disconnect
    connection_store[:thread].exit
    controller_store[:uids] -= [channel_id]
  end

  def fetch_fifty(query)
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = "0X4UNFV7P3RzUDWlly7fgD1Cx"
        config.consumer_secret     = "3QSn43Vl505x1TbClrfEz7JciF6dOtrHhBH0X9CwfX6Ofzby6u"
        config.access_token        = "2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4"
        config.access_token_secret = "zNXDFeQZrm3uEkMabpD5KyTYPTqdMn65iGT2eJixU8omP"
    end
    query_terms = query.split(',').map(&:strip)
    results_per_term = 50 / query_terms.length
    @tweets = []
    query_terms.each do |qt|
      @tweets.concat(client.search("##{qt}",:count => results_per_term, :result_type => 'recent').map do |tweet| 
        extract_tweet(tweet)
      end )
    end 
    
  end

  private 
    def extract_tweet(tweet)
      {}.tap do |tweet_obj|
        tweet_obj[:text] = word_wrap(tweet.text, line_width: $LINE_WIDTH)
        tweet_obj[:author] = '@' + tweet.attrs[:user][:screen_name]
      end
    end
end
