class Client
  attr_accessor :uuid, :tags

  def initialize(uuid, tags)
    @uuid = uuid
    @tags = tags
  end

  def regex
    return @regex if @regex
    @regex = Regexp.new(tags.split(',').map do |tag|
      "(" + tag.strip + ")"
    end.join('|'), "i")
  end
end


class TweetsController < WebsocketRails::BaseController
  include ActionView::Helpers::TextHelper
  $LINE_WIDTH = 30
  $TOTAL_MONKEYS = 100
  $REPLACEMENTS = {
    '&amp;' => '&',
    '&lt;' => '<',
    '&gt;' => '>',
    '&quot;' => '"'
  }

  def start_new
    # trigger_failure
    begin
      fetch_fifty(message["tags"])
    rescue Twitter::Error => e
      failed_error = {
        "message" => e.message
      }
    end
    Thread.abort_on_exception = true
    controller_store[:clients] ||= []
    channel_id = 0
    while controller_store[:clients].map { |client| client.uuid }.include?(channel_id)
      channel_id += 1
    end
    connection_store[:uuid] = channel_id
    controller_store[:clients] << Client.new(channel_id, message["tags"])
    restart_thread
    trigger_success({:channel_name => "tweets_#{channel_id}", :tweets => @tweets, :failed => failed_error})
  end

  def disconnect
    controller_store[:clients].reject do |client|
      client.uuid == connection_store[:uuid]
    end
    restart_thread
  end

  def restart_thread
    controller_store[:thread].exit if controller_store[:thread]
    return if controller_store[:clients].empty?
    begin
      controller_store[:thread] = Thread.new do
        controller_store[:twitter_streaming] = Twitter::Streaming::Client.new do |config|
          config.consumer_key        = Figaro.env.twitter_consumer_key
          config.consumer_secret     = Figaro.env.twitter_consumer_secret
          config.access_token        = Figaro.env.twitter_access_token
          config.access_token_secret = Figaro.env.twitter_access_secret
        end

        controller_store[:twitter_streaming].filter(track: all_tags) do |object|
          tweet = extract_tweet(object)
          controller_store[:clients].each do |client|
            if client.regex.match(tweet[:text])
              WebsocketRails["tweets_#{client.uuid}"].trigger 'new', tweet
            end
          end
        end
      end
    rescue Twitter::Error => e
      controller_store[:clients].each do |client|
        WebsocketRails["tweets_#{client.uuid}"].trigger 'streaming_error', {message: e.message}
      end
    end
  end

  def all_tags
    controller_store[:clients].inject([]) do |atags, client|
      atags + client.tags.split(",").map(&:strip)
    end.uniq.join(", ")
  end

  def fetch_fifty(query)
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = Figaro.env.twitter_consumer_key
        config.consumer_secret     = Figaro.env.twitter_consumer_secret
        config.access_token        = Figaro.env.twitter_access_token
        config.access_token_secret = Figaro.env.twitter_access_secret
    end
    query_terms = query.split(',').map(&:strip)
    results_per_term = $TOTAL_MONKEYS / query_terms.length
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
        $REPLACEMENTS.each { |replaced, replacing| tweet_obj[:text].gsub!(replaced, replacing) }
        tweet_obj[:author] = '@' + tweet.attrs[:user][:screen_name]
        # puts tweet_obj
      end
    end
end
