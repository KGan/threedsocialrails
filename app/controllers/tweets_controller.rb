class TweetsController < WebsocketRails::BaseController
  include ActionView::Helpers::TextHelper
  $LINE_WIDTH = 30
  def start_new
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
        Thread.current[:tweet] = {
          text: word_wrap(object.text, line_width: $LINE_WIDTH),
          author: '@' + object.attrs[:user][:screen_name]
        }
        WebsocketRails["tweets_#{cid}"].trigger 'new', Thread.current[:tweet]
      end
    end
    trigger_success({:channel_name => "tweets_#{channel_id}"})
  end

  def disconnect
    connection_store[:thread].exit
    controller_store[:uids] -= [channel_id]
  end
end
