import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false); // On définit un état pour savoir si la commande est prioritaire ou non, par défaut, une commande ne l'est pas
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress
  } = useSelector((state) => state.user); // On récupère les données de l'user avec un selector

  const isLoadingAddress = addressStatus === "loading"; // On créé une variable pour déterminer si l'adresse est en chargement

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"; // On créé une variable pour déterminer si la soumission est en cours

  const formErrors = useActionData();
  const dispatch = useDispatch();

  const cart = useSelector(getCart); // On récupère les données du panier
  const totalCartPrice = useSelector(getTotalCartPrice); // On récupère le montant de tous les pizzas du panier
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0; // On définit le prix de la priorité
  const totalPrice = totalCartPrice + priorityPrice; // On calcule le prix total cumulé au prix de la priorité

  if (!cart.length) return <EmptyCart />; // On retourne le composant EmptyCart si le panier est vide

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST"> {/* On créé un formulaire avec le composant Form qui est propre à React */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label> {/* Avec un premier champ pour le nom de l'utilisateur */}
          <input
            className="input grow"
            defaultValue={username}
            type="text"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label> {/* Puis son numéro de téléphone */}
          <div className="grow">
            <input
              type="tel"
              className="input w-full"
              name="phone"
              required
            /> {/* Si le champ de ce formulaire reçoit une erreur, on l'affiche sous le champ */}
            {formErrors?.phone && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              className="input w-full"
              disabled={isLoadingAddress} // Lors de la récupération de l'adresse (via la position), ce champ est désactivé
              defaultValue={address}
              name="address"
              required
            /> {/* En cas d'erreur, on affiche celle-ci sous le champ */}
            {addressStatus === "error" && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{errorAddress}</p>}
          </div>

          {!position.latitude && !position.longitude && ( /* Si la position de l'utilisateur n'est pas connue, on affiche le bouton "Get position" */
            <span className="w-50 absolute right-[3px] top-[34.5px] sm:right-[3.5px] sm:top-[2.5px] md:right-[5px] md:top-[4.5px]">
              <Button
                type="small"
                disabled={isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >Get position</Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="size-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)} /* En cas de clique, on modifie l'état de withPriority */
          />
          <label
            className="font-medium"
            htmlFor="priority"
          >Want to yo give your order priority?</label>
        </div>

        <div>
          <input
            type="hidden"
            name="cart"
            value={JSON.stringify(cart)}
          />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />

          <Button
            type="primary"
            disabled={isSubmitting || isLoadingAddress}
          >{isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) { // On créé une fonction qui est exécutée en cas de soumission du formulaire
  const formData = await request.formData(); // La méthode formData permet de lire la requête du body et la retourner en tant que promesse dans un objet formData
  const data = Object.fromEntries(formData); // On convertit les données en un objet

  const order = { // On créé la commande en récupérant les données du formulaire
    ...data,
    cart: JSON.parse(data.cart), // On parse le panier, c'est-à-dire qu'on passe d'un string à un objet
    priority: data.priority === "true", // On définit la priorité
  };

  const errors = {};
  if (!isValidPhone(order.phone)) { // Le numéro de téléphone doit respecter le regEx plus haut
    errors.phone = "Please provide a correct phone number. We might need it to contact you." // On définit le message d'erreur
  }

  if (Object.keys(errors).length > 0) { // On retourne les erreurs s'il y'en a
    return errors;
  }

  const newOrder = await createOrder(order); // On fait un appel à l'API pour créer une nouvelle commande

  store.dispatch(clearCart()); // Une fois la commandée créée, on vide le panier

  return redirect(`/order/${newOrder.id}`); // On redirige l'utilisateur vers la page de suivi de sa commande

}

export default CreateOrder;
