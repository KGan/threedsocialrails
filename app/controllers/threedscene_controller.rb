require 'uri'
require 'yajl/http_stream'

class ThreedsceneController < ApplicationController
  def index
    uri = URI.parse(<<-URI)
     'https://stream.twitter.com/1.1/statuses/filter.json' --data 'track=BlackLivesMatter' --header 'Authorization: OAuth oauth_consumer_key="0X4UNFV7P3RzUDWlly7fgD1Cx", oauth_nonce="64ecac0b1455643c98ea07ac55742436", oauth_signature="AdQMKtFvAjI9PczjGgjmDp3xxUI%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1425795836", oauth_token="2703413065-eoy3gCO8LSKdGizpGRW4nkiPRgv1FK4OWdPQfr4", oauth_version="1.0"' --verbose
    URI
    Yajl::HttpStream.get(uri, :symbolize_keys => true) do |hash|
      puts hash.inspect
    end
  end
end
