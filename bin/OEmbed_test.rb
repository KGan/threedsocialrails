require 'oembed'

url = "https://www.youtube.com/watch?v=-YO4XGLsFCk"

a = OEmbed.discover_provider(url)

puts a.fields
puts "hmm"
