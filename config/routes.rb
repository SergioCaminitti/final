Rails.application.routes.draw do
  namespace :admin do
    resources :products
    resources :categories
  end
  devise_for :admins

  # A rota para admins autenticados
  authenticated :admin do
    root to: "admin#index", as: :admin_root
  end

  # A rota principal para usuários não autenticados
  root "home#index"
end
