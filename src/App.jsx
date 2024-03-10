import { RouterProvider, createBrowserRouter } from "react-router-dom"

import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, { action as createOrderAction } from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
import AppLayout from "./ui/AppLayout";

const router = createBrowserRouter([ // Création d'un router avec la méthode createBrowserRouter de React
  {
    element: <AppLayout />, 
    errorElement: <Error />,
    children: [
      {
        path: "/", // URL d'accès
        element: <Home /> // element définit le composant qui sera render lorsque l'on navigue sur l'url concerné
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader, // Fonction exécutée au chargement du composant
        errorElement: <Error /> // Le composant qui sera render en cas d'erreur
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction // L'action détermine la fonction qui est exécutée en cas de soumission d'un formulaire
      },
      {
        path: "/order/:orderId",
        loader: orderLoader,
        element: <Order />,
        errorElement: <Error />,
        action: updateOrderAction
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} /> // On retourne le router avec RouterProvider
}

export default App

