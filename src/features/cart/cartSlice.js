import { createSlice } from "@reduxjs/toolkit";

// On créé un état intial avec un panier vide
const initialState = {
  cart: [],
};

// On créé un slice pour le panier
const cartSlice = createSlice({
  name: "cart", // On donne un nom au slice
  initialState, // On définit son état initial
  reducers : { // Et on détermine les actions rattachées à ce slice
    addItem(state, action) { // 1. Ajout d'un item dans le panier
      state.cart.push(action.payload);
    },
    deleteItem(state, action) { // 2. Supression d'un item du panier
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload)
    },
    increaseItemQuantity(state, action) { // 3. Augmenter la quantité d'un item du panier
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) { // 4. Diminuer la quantité d'un item du panier
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action); // On supprime l'item du panier si celui-ci a une quantité égale à zéro
    },
    clearCart(state) { // 5. On vide le panier (on pourrait ici également définir le state.cart à l'initialState)
      state.cart = [];
    },
  }
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart 
} = cartSlice.actions; // On exporte les actions

export default cartSlice.reducer; // On exporte le reducer

export const getCart = (state) => state.cart.cart; // On créé une fonction qui permet de récupérer l'état du panier

export const getTotalCartQuantity = (state) => state.cart.cart.reduce((sum, item) => sum + item.quantity, 0); // On créé une fonction pour connaître le nombre de pizza dans le panier

export const getTotalCartPrice = (state) => state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0); // On créé une fonction pour récupérer le montant total du panier

export const getCurrentQuantityById = (id) => (state) => state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0; // On récupère la quantité d'une pizza avec son id, et si la quantité est nulle, on retourne 0