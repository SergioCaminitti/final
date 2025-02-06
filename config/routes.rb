Rails.application.routes.draw do
  namespace :admin do
    resources :orders
    resources :products do
      resources :stocks
    end
    resources :categories
  end
  devise_for :admins
  root "home#index"

  authenticated :admin do
    root to: "admin#index", as: :admin_root
  end

  resources :categories, only: [ :show ]
  resources :products, only: [ :show ]

  get "cart" => "carts#show"

  get "/success", to: "checkouts#success"
  get "/cancel", to: "checkouts#cancel"

  post "checkout" => "checkouts#create"
end
