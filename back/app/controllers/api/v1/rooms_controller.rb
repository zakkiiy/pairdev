class Api::V1::RoomsController < ApplicationController
  before_action :set_current_user

  def show
    post = Post.find(params[:post_id])
    @room = post.room
    if @room
      render json: { room: @room, post: post }
    else
      render json: { error: "Room not found" }, status: :not_found
    end
  end

  def status
    post = Post.find(params[:post_id])

    if post && post.room
      post.room.update_room_status # ステータスを更新する場合
      render json: { status: post.room.status }
    else
      render json: { error: "Room not found" }, status: :not_found
    end
  end

  def join_status
    post = Post.find(params[:post_id])
    room = post.room
  
    if RoomUser.exists?(user_id: @current_user.id, room_id: room.id)
      render json: { isJoined: true }
    else
      render json: { isJoined: false }
    end
  end
end
