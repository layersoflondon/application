class RecordsController < ApplicationController
  def index
    @records = Record.all
  end

  def show
    @record = Record.find(params[:id])
  end

  def new
  end

  def edit
  end

  def create
    @record = Record.find(params[:id])
  end

  def update
  end

  def destroy
  end
end
