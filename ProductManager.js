import fs from 'fs';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  generateId() {
    const ids = this.products.map(product => product.id);
    const maxId = ids.length === 0 ? 0 : Math.max(...ids);
    return maxId + 1;
  }

  addProduct(productData) {
    const product = {
      id: this.generateId(),
      ...productData,
      status: true // Añade el campo status por defecto
    };

    this.products.push(product);
    this.saveProducts();
    return product;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields, id };
      this.saveProducts();
      return this.products[index];
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
    } else {
      throw new Error('Producto no encontrado');
    }
  }
}

export default ProductManager;
