# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = root_url

SitemapGenerator::Sitemap.create do
  
  # top level pages from rooftop, and children
  # guide_path
  # faq_entry
  # post
  # /map
  # /map/layers
  # /map/records/:id
  # /map/records/:id/media/:media_item_id
  # /map/collections/:collecton_id
  # /map/search?results=true&collections=true
  # 
  Page.all.select {|p| p.parent.nil?}.each do |page|
    add(page_path(page.nested_path), lastmod: page.updated_at)
    page.resolved_children.each do |child|
      add(page_path(child.nested_path), lastmod: child.updated_at)
      child.resolved_children.each do |grandchild|
        add(page_path(grandchild.nested_path), lastmod: grandchild.updated_at)
      end
    end
  end

  Rooftop::FaqEntry.all.each do |faq|
    add(faq_path(faq.slug), lastmod: faq.updated_at)
  end

  Post.all.each do |post|
    add(post_path(post.slug), lastmod: post.updated_at)
  end

  Rooftop::Guide.all.each do |guide|
    add(guide_path(guide.slug), lastmod: guide.updated_at)
  end

  add(map_path, {changefreq: :always})

  add(resources_map_path(resource: :layers), lastmod: Layer.order(updated_at: :desc).limit(1).first.try(:updated_at))

  RecordsIndex.published.scroll_objects.each do |r|
    add(resource_map_path(resource: :records, id: r.id), lastmod: r.updated_at)
    r.attachments.each do |att|
      add(resource_map_path(resource: "records/#{r.id}/media", id: att['id']))
    end
  end

  CollectionsIndex.published.scroll_objects.each do |c|
    add(resource_map_path(resource: :collection, id: c.id), lastmod: c.updated_at)
  end

  add(resources_map_path(resource: :search, results: true, collections: true), changefreq: :always)


  
  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  #
  # Usage: add(path, options={})
  #        (default options are used if you don't specify)
  #
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host
  #
  # Examples:
  #
  # Add '/articles'
  #
  #   add articles_path, :priority => 0.7, :changefreq => 'daily'
  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end
  end
