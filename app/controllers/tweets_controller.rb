class TweetsController < WebsocketRails::BaseController
  include ActionView::Helpers::TextHelper
  def start_new
    Thread.abort_on_exception = true
    controller_store[:uids] ||= []
    trigger_failure({:error => 'not logged in'}) unless current_user
    unless controller_store[:uids].include?(current_user.id)
      controller_store[:uids] << current_user.id
      connection_store[:thread] = Thread.new(current_user.id) do |cid|
        Thread.current[:client] = Twitter::Streaming::Client.new do |config|
          config.consumer_key        = "0X4UNFV7P3RzUDWlly7fgD1Cx"
          config.consumer_secret     = "3QSn43Vl505x1TbClrfEz7JciF6dOtrHhBH0X9CwfX6Ofzby6u"
          config.access_token        = "2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4"
          config.access_token_secret = "zNXDFeQZrm3uEkMabpD5KyTYPTqdMn65iGT2eJixU8omP"
        end

        Thread.current[:client].filter(track: "Bae Bae") do |object|
          puts 'hi'
          Thread.current[:tweet] = {
            text: word_wrap(object.text, line_width: $LINE_WIDTH),
            author: '@' + object.attrs[:user][:screen_name]
          }
          puts Thread.current[:tweet]
          WebsocketRails["tweets_#{cid}"].trigger 'new', Thread.current[:tweet]
        end
      end
    end
    trigger_success({:channel_name => "tweets_#{current_user.id}"})
  end

  def disconnect
    connection_store[:thread].exit
    controller_store[:uids] -= [current_user.id]
  end
end
