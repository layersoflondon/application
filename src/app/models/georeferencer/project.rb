class Georeferencer::Project < ApplicationRecord
  include FriendlyId

  friendly_id :name

  def images
    @images ||= Georeferencer::Image.where(collection: georeferencer_id).unreferenced.fetch
  end

  def progress
    @progress ||= Georeferencer::Progress.find(georeferencer_id)
  end

  def centroid
    if has_centroids?
      centroids = images.collect(&:centroid).collect(&:values)
      [(centroids.collect(&:first).inject(:+) / centroids.length), (centroids.collect(&:last).inject(:+) / centroids.length)]
    else
      Rails.configuration.x.map_centre
    end
  end

  def has_centroids?
    images.collect(&:centroid).all?
  end

  def complete?
    progress.num_waiting == 0
  end

  def image
    images.first.try(:url,650) || []
  end

  def images_cache_key
    "georeferencer/project/#{slug}/images"
  end

  def progress_cache_key
    "#{cache_key}/progress"
  end

end
