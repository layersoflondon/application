class ImageProcessingJob < ApplicationJob
  queue_as :default

  def perform(id)
    image = Attachments::Image.find(id)
    image.generate_variants!
  end
end
