class ThreedsceneController < ApplicationController
  def index
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = "0X4UNFV7P3RzUDWlly7fgD1Cx"
        config.consumer_secret     = "3QSn43Vl505x1TbClrfEz7JciF6dOtrHhBH0X9CwfX6Ofzby6u"
        config.access_token        = "2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4"
        config.access_token_secret = "zNXDFeQZrm3uEkMabpD5KyTYPTqdMn65iGT2eJixU8omP"
    end

    @trends = client.trends(1).map{ |trend| trend.name.gsub('#', '') }.join(', ')
  end
end
