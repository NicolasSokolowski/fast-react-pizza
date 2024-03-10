import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) { // On reçoit les données de la pizza via le composant parent Menu
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza; // On destructure les données
  const currentQuantity = useSelector(getCurrentQuantityById(id)); // On récupère la quantité de la pizza
  const isInCart = currentQuantity > 0; // On créé un variable qui retournera un booléen 

  function handleAddToCart() { // On créé une fonction pour ajouter une pizza au panier
    const newItem = { // On créé un nouvel objet
      pizzaId: id, // On récupère l'id de la pizza,
      name, // son nom
      quantity: 1, // On ne peut ajouter qu'une pizza à la fois dans le panier
      unitPrice, // son prix unitaire
      totalPrice: unitPrice * 1
    };

    dispatch(addItem(newItem)); // On envoie la pizza au reducer qui s'occupe de mettre à jour le store
  }

  return (
    <li className="flex gap-4 py-2">
      <img
        className={`h-24 ${soldOut ? "opacity-70 grayscale" : ""}`} // L'opacité est modifiée si la pizza est sold out
        src={imageUrl}
        alt={name}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">{ingredients.join(', ')}</p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? ( // Opérateur ternaire pour afficher le prix d'une pizza si elle n'est pas soldout,
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : ( // Ou un texte "sold out" si la pizza n'est pas disponible
            <p className="text-sm font-medium uppercase text-stone-500">Sold out</p>
          )}

          {isInCart && ( // Si la pizza est déjà dans le panier, alors on render les composants pour update et delete la quantité
            <div className="flex items-center gap-3 sm:gap-8">
              <UpdateItemQuantity pizzaId={id} currentQuantity={currentQuantity}/>
              <DeleteItem pizzaId={id} />
            </div>
          )}

          {!soldOut && !isInCart && <Button type="small" onClick={handleAddToCart}>Add to cart</Button>} {/* Ce bouton s'affiche uniquement si la pizza n'est pas sold out et qu'elle n'est pas déjà dans le panier */}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
