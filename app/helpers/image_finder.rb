module ImageFinder
  def get_image_url(page_url)
    page = Nokogiri::HTML(open(page_url))
    og_featured = page.xpath("//img[@property='og:image' OR @property='twitter:image' OR @property='shareaholic:image']")
    main_images = page.xpath("//img[ancestor::*[contains(@id, 'content') or contains(@id, 'main') or contains(@id, 'article')]]")
    not_string = "//img[not(ancestor::*[contains(@id, 'sidebar') or contains(@id, 'comment') or contains(@id, 'footer') or contains(@id, 'header')]) and ancestor::*[contains(@id, 'content')]]"
    main_images = main_images.xpath(not_string)
    other_images = page.xpath(not_string)
    video_link = page.xpath("//iframe[not(ancestor::*[contains(@id, 'sidebar') or contains(@id, 'comment') or contains(@id, 'footer') or contains(@id, 'header')]) and contains(@src, 'youtube')]/@src")[0]
    video_image = OEmbed.get(video_link.src).thumbnail_url if video_link

    #skip anything less than 5k pixels in area

  end
end
