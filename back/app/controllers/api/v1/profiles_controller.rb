class Api::V1::ProfilesController < ApplicationController
  before_action :set_current_user

  def edit_form
    profile = @current_user.profile
    render json: profile
  end

  def update
    p params
    if @current_user.profile.update(profile_params)
      p '成功'
    else
      p '失敗'
    end
  end

  private

  def profile_params
    params.require(:profile).permit(:local_name, :gender, :age, :experience, :description)
  end
end
