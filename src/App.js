import React, { Component } from "react";
import { commerce } from "./lib/Commerce";
import "./styles/scss/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShoppingBag, faTimes } from "@fortawesome/free-solid-svg-icons";

import Hero from "./components/Hero";
import ProductsList from "./components/ProductsList";
import Cart from "./components/Cart";

library.add(faShoppingBag, faTimes);

class App extends Component {
  state = {
    merchant: {},
    products: [],
    cart: {},
    isCartVisible: false,
  };

  componentDidMount() {
    this.fetchMerchantDetails();
    this.fetchProducts();
    this.fetchCart();
  }

  /**
   * Show hide cart in nav
   */
  toggleCart = () => this.setState(({ isCartVisible }) => ({ isCartVisible: !isCartVisible }));

  /**
   * Fetch merchant details
   * https://commercejs.com/docs/sdk/full-sdk-reference#merchants
   */
  fetchMerchantDetails = async () => {
    try {
      const merchant = await commerce.merchants.about();
      this.setState({ merchant });
    } catch (e) {
      console.log("There was an error fetch the merchant details", e);
    }
  };

  /**
   * Fetch products data from Chec and stores in the products data object.
   * https://commercejs.com/docs/sdk/products
   */
  fetchProducts = async () => {
    try {
      const { data } = await commerce.products.list();
      this.setState({ products: data });
    } catch (e) {
      console.log("There was an error fetching the products", e);
    }
  };

  /**
   * Retrieve the current cart or create one if one does not exist
   * https://commercejs.com/docs/sdk/cart
   */
  fetchCart = async () => {
    try {
      const cart  = await commerce.cart.retrieve();
      this.setState({ cart: cart });
    } catch (e) {
      console.error("There was an error fetching the cart", e);
    }
  };

  /**
   * Adds a product to the current cart in session
   * https://commercejs.com/docs/sdk/cart/#add-to-cart
   *
   * @param {string} productId The ID of the product being added
   * @param {number} quantity The quantity of the product being added
   */
  handleAddToCart = async (productId, quantity) => {
    try {
      const { cart } = await commerce.cart.add(productId, quantity);
      this.setState({ cart: cart });
    } catch (e) {
      console.error("There was an error adding the item to the cart", e);
    }
  };

  /**
   * Updates line_items in cart
   * https://commercejs.com/docs/sdk/cart/#update-cart
   *
   * @param {string} lineItemId ID of the cart line item being updated
   * @param {number} newQuantity New line item quantity to update
   */
  handleUpdateCartQty = async (lineItemId, quantity) => {
    try {
      const { cart } = await commerce.cart.update(lineItemId, { quantity });
      this.setState({ cart: cart });
    } catch (e) {
      console.log("There was an error updating the cart items", e);
    }
  };

  /**
   * Removes line item from cart
   * https://commercejs.com/docs/sdk/cart/#remove-from-cart
   *
   * @param {string} lineItemId ID of the line item being removed
   */
  handleRemoveFromCart = async (lineItemId) => {
    try {
      const { cart } = await commerce.cart.remove(lineItemId);
      this.setState({ cart });
    } catch (e) {
      console.error("There was an error removing the item from the cart", e);
    }
  };
  renderCartNav() {
    const { cart, isCartVisible } = this.state;

    return (
      <div className="nav">
        <div className="nav__cart" onClick={this.toggleCart}>
          {!isCartVisible ? (
            <button className="nav__cart-open">
              <FontAwesomeIcon size="2x" icon="shopping-bag" color="#292B83"/>
              {cart !== null ? <span>{cart.total_items}</span> : ''}
            </button>
            ) : (
              <button className="nav__cart-close">
                <FontAwesomeIcon size="1x" icon="times" color="white"/>
              </button>
            )}
        </div>
      </div>
    )
  }
  /**
   * Empties cart contents
   * https://commercejs.com/docs/sdk/cart/#remove-from-cart
   */
  handleEmptyCart = async () => {
    try {
      const { cart } = await commerce.cart.empty();
      this.setState({ cart });
    } catch (e) {
      console.error("There was an error emptying the cart", e);
    }
  };

  render() {
    const { products, merchant, cart, isCartVisible } = this.state;

    return (
      <div className="app">
        {this.renderCartNav()}
        {isCartVisible && (
          <Cart
            cart={cart}
            onUpdateCartQty={this.handleUpdateCartQty}
            onRemoveFromCart={this.handleRemoveFromCart}
            onEmptyCart={this.handleEmptyCart}
          />
        )}
        <Hero merchant={merchant} />
        <ProductsList products={products} onAddToCart={this.handleAddToCart} />
      </div>
    );
  }
}

export default App;
