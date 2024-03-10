import LinkButton from '../../ui/LinkButton';
import CartItem from './CartItem';
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart } from './cartSlice';

function Cart() {
  const username = useSelector((state) => state.user.username); // On récupère le nom de l'utilisateur avec un useSelector
  const cart = useSelector(getCart); // On récupère l'état du panier
  const dispatch = useDispatch(); // On récupère les actions du store grâce au useDispatch que l'on stocke dans une variable 

  if (!cart.length) return <EmptyCart />; // Si le panier est vide, on affiche le composant "EmptyCart"

  return (
    <div className='px-4 py-3'>
      <LinkButton to="/menu" >&larr; Back to menu</LinkButton>

      <h2 className='mt-7 text-xl font-semibold'>Your cart, {username}</h2> {/* On affiche le nom de l'utilisateur */}

      <ul className='mt-3 divide-y divide-stone-200 border-b'>
        {cart.map((item) => <CartItem item={item} key={item.pizzaId} />)} {/* Pour chaque item dans le panier, on render le composant CartItem tout en lui passant les données dont il a besoin */}
      </ul>

      <div className='mt-6 space-x-2'>
        <Button
          to="/order/new"
          type="primary"
        >Order pizzas</Button>

        <Button type="secondary" onClick={() => dispatch(clearCart())}>Clear cart</Button> {/* On applique l'action "clearCart" du userSlice lors d'un clique sur ce bouton */}
      </div>
    </div>
  );
}

export default Cart;
