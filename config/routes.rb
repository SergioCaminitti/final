Rails.application.routes.draw do
  namespace :admin do
    resources :orders
    resources :products do
      resources :stocks
    end
    resources :categories
  end
  devise_for :admins
  resources :categories, only: [ :show ]
  resources :products, only: [ :show ]

  get "cart" => "carts#show"
  post "checkout" => "checkouts#create"

  # A rota para admins autenticados
  authenticated :admin do
    root to: "admin#index", as: :admin_root
  end

  # A rota principal para usuários não autenticados
  root "home#index"
end
