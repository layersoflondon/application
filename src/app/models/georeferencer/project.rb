class Georeferencer::Project < ApplicationRecord
  include FriendlyId

  friendly_id :name

  def images
    Georeferencer::Image.where(collection: georeferencer_id)
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
  
end
