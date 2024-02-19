require 'net/http'
require 'uri'
require 'json'

# apprication_controller
class ApplicationController < ActionController::API
  include ActionController::Cookies

  # def handle_options_request
  #   response.headers['Access-Control-Allow-Origin'] = '*'
  #   response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
  #   response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

  #   head :ok
  # end

  private

  def set_current_user
    received_access_token = request.headers["Authorization"].split.last

    if session[:user_id] && session[:access_token] == received_access_token

      # セッションからユーザー情報を取得
      @current_user = User.find_by(id: session[:user_id])
    else
      # GitHub APIからユーザー情報を取得
      session.delete(:access_token)
      user_info = fetch_user_info_from_github(received_access_token)

      # GitHubのuidをもとにユーザー検索
      @current_user = User.find_by(uid: user_info['id'])

      # セッションにユーザー情報を保存
      session[:user_id] = @current_user.id
      session[:access_token] = received_access_token
    end
  end

  # GiHtubのユーザー情報を取得
  def fetch_user_info_from_github(access_token)
    uri = URI.parse("https://api.github.com/user")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{access_token}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  end
end
