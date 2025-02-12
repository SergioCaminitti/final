import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Garante que cart seja um array
    if (cart.length === 0) {
      return; // Não faz nada se o carrinho estiver vazio
    }

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.classList.add("mt-2");
      div.innerText = `Item: ${item.name} - ${item.price} - ${item.size} - Quantity: ${item.quantity}`;
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Remove";
      deleteButton.value = item.id;
      deleteButton.classList.add(
        "bg-gray-500",
        "rounded",
        "text-white",
        "px-2",
        "py-1",
        "ml-2",
      );
      deleteButton.addEventListener("click", this.removeFromCart);
      div.appendChild(deleteButton);
      this.element.prepend(div);
    }

    const totalEl = document.createElement("div");
    totalEl.innerText = `Total R$: ${total}`;
    const totalContainer = document.getElementById("total");
    totalContainer.appendChild(totalEl);
  }

  clear() {
    localStorage.removeItem("cart");
    window.location.reload();
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const id = event.target.value;
    const index = cart.findIndex((item) => item.id === id);
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const payload = {
      authenticity_token: "",
      cart: cart,
    };

    const csrfToken = document.querySelector("[name='csrf-token']").content;
    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data); // Inspecionar a resposta
          if (data.url) {
            window.location.href = data.url; // Redireciona para a URL do Stripe
          } else {
            const errorEl = document.createElement("div");
            errorEl.innerText = "Erro: URL do Stripe não encontrada.";
            const errorContainer = document.getElementById("errorContainer");
            errorContainer.appendChild(errorEl);
          }
        });
      } else {
        response.json().then((data) => {
          const errorEl = document.createElement("div");
          errorEl.innerText = `Erro ao processar seu pedido: ${data.error}`;
          const errorContainer = document.getElementById("errorContainer");
          errorContainer.appendChild(errorEl);
        });
      }
    });
  }
}
