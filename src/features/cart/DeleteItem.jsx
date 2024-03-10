import { useDispatch } from "react-redux"
import { deleteItem } from "./cartSlice";
import Button from "../../ui/Button"

function DeleteItem({ pizzaId }) { // On reçoit l'id de la pizza par le composant CartItem
  const dispatch = useDispatch();

  return ( /* Lors d'un clique, on supprime l'élément */
    <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>Delete</Button> 
  ); 
}

export default DeleteItem;
