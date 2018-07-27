require 'open-uri'
namespace :lol do
  desc "Migrate posts from the Alpha site"
  task migrate_posts: :environment do
    posts = YAML.load_file(File.join(Rails.root,'db','posts.yml')).collect(&:with_indifferent_access)
    posts.each do |post|
      puts post[:title]
      content = cleanup_content!(post[:content][:basic][:content])
      rooftop_post = ::Post.find_by(slug: post[:slug]).first || ::Post.new(title: post[:title], content: {basic: {content: content}}, status: 'publish', slug: post[:slug])
      rooftop_post.fields.publication_date = post[:date].strftime('%Y%m%d')
      rooftop_post.save
      puts "saved"
    end
  end

  def cleanup_content!(content)
    html = Nokogiri::HTML.fragment(content)
    puts "rewriting images"
    images = html.css('img')
    images.each do |img|
      # get the original large image
      source_url = img.attr('src')
      next unless source_url.match(/layersoflondon/)
      filename = File.basename(source_url)
      if filename.match(/\d+x\d+/)
        # we need to get the original file
        matchdata = filename.match(/^(.*)(-\d+x\d+)(\.\w+)/)
        original_filename = "#{matchdata[1]}#{matchdata[3]}"
      else
        original_filename = filename
      end
      local_filename = File.join(Rails.root, 'tmp', original_filename)

      File.open(local_filename,'wb') do |f|
        f.write open("https:/#{File.dirname(source_url)}/#{original_filename}").read
      end

      title = original_filename
      caption = img.attr('alt')
      begin
        puts "Creating new media item for #{title}"
        # create a MediaItem for each image, and swap out the source
        item = Rooftop::MediaItem.new(title: title, caption: caption)
        item.file = File.open(local_filename, 'rb')
        item.save
        img.attributes['src'].value = item.source_url
        html.css('a').collect do |link|
          if link.attr('href').match(original_filename)
            link.attributes['href'].value = item.source_url
          end
        end
        File.unlink(local_filename)
      rescue => e
        puts e
        puts e.backtrace
      end
    end
    return html.to_s
  end
end