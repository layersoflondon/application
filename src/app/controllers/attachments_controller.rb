# frozen_string_literal: true

class AttachmentsController < ApplicationController
  def index
    @attachments = Attachment.all
  end

  def create; end

  def show; end

  def update; end

  def destroy; end
end
