class Post
  include Rooftop::Post

  BLOG_CATEGORY_ID = 6
  EVENT_CATEGORY_ID = 4

  def self.all
    published(super)
  end


  scope :blog_articles, -> {
    sorted_by_date(published(where(category_name: 'blog')))
  }

  scope :events, -> {
    sorted_by_date(published(where(category_name: 'event')))
  }
  

  def self.sorted_by_date(collection)
    collection.sort{|a,b| b.sort_date.to_i <=> a.sort_date.to_i}
  end

  def self.published(collection)
    collection.select {|p| p.publication_date <= DateTime.now}
  end

  def self.latest_n(collection, n)
    collection[0..n-1]
  end


  def publication_date
    DateTime.parse(fields.try(:publication_date)) rescue created_at
  end

  def blog?
    categories.include?(BLOG_CATEGORY_ID)
  end

  def event?
    categories.include?(EVENT_CATEGORY_ID)
  end
end