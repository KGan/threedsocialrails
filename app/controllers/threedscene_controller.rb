class ThreedsceneController < ApplicationController
  def index
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = Figaro.env.twitter_consumer_key
        config.consumer_secret     = Figaro.env.twitter_consumer_secret
        config.access_token        = Figaro.env.twitter_access_token
        config.access_token_secret = Figaro.env.twitter_access_secret
    end
    @trends = client.trends(1).map{ |trend| trend.name.gsub('#', '') }.join(', ')
    # @trends = "test trends and country music"
  end
end
