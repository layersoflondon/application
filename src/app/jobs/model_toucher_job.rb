class ModelToucherJob < ApplicationJob
  queue_as :default

  def perform(klass,id)
    Chewy.strategy(:active_job) do
      klass.to_s.constantize.find(id).touch

    end
  end
end
