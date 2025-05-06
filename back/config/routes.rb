Rails.application.routes.draw do
  namespace :v1 do
    resources :users, only: [:create, :destroy]
    resources :transactions, only: [:index, :create, :destroy]
    resources :settlements, only: [:index, :create, :destroy]
    resources :balances, only: [:index] 
  end
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
