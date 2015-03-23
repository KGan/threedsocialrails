require 'open-uri'
require 'openssl'
require 'oembed'
require 'nokogiri'

module ImageFinder
  def self.get_image_url(page_url)
    page = Nokogiri::HTML(open(page_url))
    puts og_featured = page.xpath("//img[contains(@property, 'og:image') or contains(@property, 'twitter:image') or contains(@property, 'shareaholic:image')]")
    # return og_featured.first.src if og_featured
    puts image_selector = "//*[contains(@src, 'jpg') or contains(@src, 'png') or contains(@src, 'gif')]"
    puts images = page.xpath(image_selector)
    main_images = images.xpath("*[ancestor::*[contains(@id, 'content') or contains(@id, 'main') or contains(@id, 'article')]]")
    not_string = "*[not(ancestor::*[contains(@id, 'sidebar') or contains(@id, 'comment') or contains(@id, 'footer') or contains(@id, 'header')])]"
    puts main_images = main_images.xpath(not_string)
    puts other_images = images.xpath(not_string)
    video_link = page.xpath("//iframe[not(ancestor::*[contains(@id, 'sidebar') or contains(@id, 'comment') or contains(@id, 'footer') or contains(@id, 'header')]) and contains(@src, 'youtube')]/@src")[0]
    video_image = find_oembed_provider(video_link.src).get(video_link.src).thumbnail_url if video_link
    return page
    #skip anything less than 5k pixels in area

  end

  def self.find_oembed_provider(url)
    OEmbed::Providers.constants.each do |provider_const|
      provider = OEmbed::Providers.const_get(provider_const)
      provider.urls.each do |matcher|
        return provider if matcher.match(url)
      end
    end
  end
end
