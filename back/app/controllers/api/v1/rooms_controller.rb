module Api
  module V1
    # Api::V1::RoomsController handles API requests for posts.
    class RoomsController < ApplicationController
      before_action :set_current_user

      def show
        post = Post.find(params[:post_id])
        @room = post.room
        if @room
          is_creator = @current_user.id == post.user_id
          is_participant = @room.users.exists?(@current_user.id)
          users_with_profiles = @room.users.includes(:profile)
          user_names = @room.users.map(&:name)
          avatar_urls = @room.users.map(&:avatar_url)

          profiles = users_with_profiles.map do |user|
            user.profile.attributes
          end

          participant_count = @room.current_participant_count
          render json: { room: @room, post:, isCreator: is_creator, isParticipant: is_participant, userNames: user_names, participantCount: participant_count, avatarUrls: avatar_urls,
                         profiles: }
        else
          render json: { error: "Room not found" }, status: :not_found
        end
      end

      def destroy
        post = Post.find(params[:post_id])
        room = post.room
        room_user = @current_user.room_users.find_by(room:)

        if room_user
          room_user.destroy
          render json: { message: "部屋から退出しました" }, status: :ok
        else
          render json: { error: "すでに部屋から退出しています" }, status: :not_found
        end
      end

      def status
        post = Post.find(params[:post_id])

        if post&.room
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
  end
end
