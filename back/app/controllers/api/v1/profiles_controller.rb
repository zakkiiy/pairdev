class Api::V1::ProfilesController < ApplicationController
  before_action :set_current_user

  def edit_form
    profile = @current_user.profile
    render json: profile
  end
end
