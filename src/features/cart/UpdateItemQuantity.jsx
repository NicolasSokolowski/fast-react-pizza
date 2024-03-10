import { useDispatch } from "react-redux"
import Button from "../../ui/Button"
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, currentQuantity }) { // On reçoit l'id de la pizza et sa quantité actuelle du composant CartItem
  const dispatch = useDispatch(); // On récupère les actions du store.

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button type="round" onClick={() => dispatch(decreaseItemQuantity(pizzaId))} >-</Button> {/* Lors d'un clique, on exécute l'action pour diminuer la quantité de l'item concerné */}
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button type="round" onClick={() => dispatch(increaseItemQuantity(pizzaId))} >+</Button> {/* Lors d'un clique, on exécute l'action pour augmenter la quantité de l'item concerné */}
    </div>
  )
}

export default UpdateItemQuantity;
