Rails.application.routes.draw do
  match '*path', controller: 'application', action: 'handle_options_request', via: :options
  mount ActionCable.server => '/cable'
  post 'auth/:provider/callback', to: 'api/v1/users#create'
  namespace :api do
    namespace :v1 do
      resources :room_users, only: [:index], path: 'user_rooms'
      resource :profile, only: [:index, :edit, :update] do
        get 'edit_form', on: :member
      end
      resources :tags, only: [:index]
      resources :posts, only: [:index, :create, :show, :update, :destroy] do
        get 'room_status', to: 'rooms#status'
        get 'room_join_status', to: 'rooms#join_status'
        resource :room do
          resource :room_user, only: [:create]
        end
      end

      resources :user_posts, only: [:index, :create, :show, :update, :destroy] do
        get 'edit_form', on: :member
      end

      resources :rooms, only: [] do
        resources :messages
      end

    end
    
  end
end
