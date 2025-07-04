Rails.application.routes.draw do
  namespace :v1 do
    resources :groups, only: [:show, :create, :update, :destroy] do
      resources :users,        only: [:index, :create, :destroy]
      resources :transactions, only: [:index, :create, :update, :destroy]
      resources :settlements,  only: [:index, :create, :destroy]
      resources :balances,     only: [:index]
    end
  end
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
