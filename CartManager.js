import fs from 'fs';

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  generateId() {
    const ids = this.carts.map(cart => cart.id);
    const maxId = ids.length === 0 ? 0 : Math.max(...ids);
    return maxId + 1;
  }

  createCart() {
    const cart = {
      id: this.generateId(),
      products: []
    };

    this.carts.push(cart);
    this.saveCarts();
    return cart;
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const existingProduct = cart.products.find(item => item.product === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    this.saveCarts();
  }
}

export default CartManager;
