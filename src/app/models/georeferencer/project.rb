class Georeferencer::Project < ApplicationRecord
  include FriendlyId

  friendly_id :name

  def images
    @images ||= Georeferencer::Image.where(collection: georeferencer_id)
  end

  def progress
    @progress ||= Georeferencer::Progress.find(georeferencer_id)
  end

  def centroid
    if has_centroids?
      centroids = images.unreferenced.collect(&:centroid).collect(&:values)
      [(centroids.collect(&:first).inject(:+) / centroids.length), (centroids.collect(&:last).inject(:+) / centroids.length)]
    else
      Rails.configuration.x.map_centre
    end
  end

  def has_centroids?
    images.unreferenced.collect(&:centroid).all?
  end

  def complete?
    progress.num_waiting == 0
  end

  def image
    if complete?
      images.where(limit: 1).first.url(650)
    else
      images.unreferenced.where(limit: 1).first.url(650)
    end
  end

end
