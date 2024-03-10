import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "../menu/MenuItem";

function Menu() {
  const menu = useLoaderData(); // On utilise le loader défini dans le composant App qui est rattaché au composant Menu (voir plus bas)

  return (
    <ul className="space-y-2 divide-y divide-stone-200 px-2">
      {menu.map((pizza) => ( /* Pour chaque itération, on render le composant MenuItem auquel on passe les données de la pizza */
        <MenuItem
          pizza={pizza}
          key={pizza.id}
        />
      ))}
    </ul>
  )
}

export async function loader() { // Le loader est la fonction exécutée au chargement du composant, ici on récupère le menu qu'on retourne ensuite
  const menu = await getMenu();
  return menu;
}

export default Menu;
