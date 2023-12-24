Rails.application.routes.draw do
  post 'auth/:provider/callback', to: 'api/v1/users#create'
  resources :posts
end
