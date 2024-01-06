Rails.application.routes.draw do
  post 'auth/:provider/callback', to: 'api/v1/users#create'
  namespace :api do
    namespace :v1 do
      resources :posts, only: [:index, :create, :show, :update, :destroy]
      resources :user_posts, only: [:index, :create, :show, :update, :destroy]
    end
  end
end