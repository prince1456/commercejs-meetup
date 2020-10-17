import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CartNav = ({ cart, isCartVisible, toggleCart }) => {
  return (
    <div className="nav">
      <div className="nav__cart" onClick={toggleCart}>
        {!isCartVisible ? (
          <button className="nav__cart-open">
            <FontAwesomeIcon size="2x" icon="shopping-bag" color="#292B83" />
            {cart !== null ? <span>{cart.total_items}</span> : ""}
          </button>
        ) : (
          <button className="nav__cart-close">
            <FontAwesomeIcon size="1x" icon="times" color="white" />
          </button>
        )}
      </div>
    </div>
  );
};
export default CartNav;
