class Api::V1::MessagesController < ApplicationController
  before_action :set_current_user

  def index
    room = Room.find(params[:room_id])
    messages = room.messages.includes(:user).order(created_at: :desc)
    render json: messages.as_json(include: { user: { only: [:id, :name] } })
  end
end
