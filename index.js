import ProductManager from './ProductManager.js';

const productManager = new ProductManager('productos.json');

// Ejemplo de uso:
const addedProduct = productManager.addProduct({
  title: 'Esto es una prueba',
  description: 'Coderhouse backend',
  price: 750,
  thumbnail: 'Sin imagen',
  code: 'QQ252',
  stock: 8
});

console.log('Producto agregado:', addedProduct);
console.log('Lista de productos:', productManager.getProducts());
console.log('Producto por id:', productManager.getProductById(addedProduct.id));

productManager.updateProduct(addedProduct.id, { price: 250 });
console.log('Producto actualizado:', productManager.getProductById(addedProduct.id));

productManager.deleteProduct(addedProduct.id);
console.log('Producto eliminado');
console.log('Lista de productos actualizada:', productManager.getProducts());
