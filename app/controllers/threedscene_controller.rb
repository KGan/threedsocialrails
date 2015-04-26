require 'uri'
require 'twitter'
require 'websocket-rails'

$LINE_WIDTH = 30

class ThreedsceneController < ApplicationController
  include ActionView::Helpers::TextHelper

  def index
    puts "what up@@"
    # uri = URI.parse(<<-URI)
    #   --data  --header '' --verbose
    # URI
    # Thread.abort_on_exception = true
    Thread.new do
      client = Twitter::Streaming::Client.new do |config|
        config.consumer_key        = "0X4UNFV7P3RzUDWlly7fgD1Cx"
        config.consumer_secret     = "3QSn43Vl505x1TbClrfEz7JciF6dOtrHhBH0X9CwfX6Ofzby6u"
        config.access_token        = "2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4"
        config.access_token_secret = "zNXDFeQZrm3uEkMabpD5KyTYPTqdMn65iGT2eJixU8omP"
      end
      client.filter(track: "Bae Bae") do |object|
        # debugger
        tweet = {
          text: word_wrap(object.text, line_width: $LINE_WIDTH),
          author: '@' + object.attrs[:user][:screen_name]
        }
        puts tweet
        # puts object.text if object.is_a?(Twitter::Tweet)
        WebsocketRails[:tweets].trigger 'new', tweet
      end
    end
  end
end
