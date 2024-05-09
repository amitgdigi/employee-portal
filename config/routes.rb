Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      post "login", to: "sessions#create", as: "login"
      delete "logout", to: "sessions#destroy", as: "logout"
      post "signup", to: "users#create", as: "signup"
      post "reset_password", to: "users#update", as: "reset"
      post "password_resets", to: "password_resets#create", as: "password_resets"
      
      get '/password_resets', to: 'password_resets#new'
      post '/password_resets', to: 'password_resets#create'
      get '/password_resets/edit', to: 'password_resets#edit'
      patch '/password_resets', to: 'password_resets#update'
      resources :rooms do
        resources :messages
      end
      resources :users

      get 'exercises/index'
      post 'exercises/create'
      get '/show/:id', to: 'exercises#show'
      delete '/destroy/:id', to: 'exercises#destroy'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
