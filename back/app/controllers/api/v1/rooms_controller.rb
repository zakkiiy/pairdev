class Api::V1::RoomsController < ApplicationController
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
end
