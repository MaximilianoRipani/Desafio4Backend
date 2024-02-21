import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const port = 8000;

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

// Configuración del motor de plantillas Handlebars
const handlebars = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para manejar las solicitudes POST para agregar productos
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    try {
        const addedProduct = productManager.addProduct(newProduct);
        io.emit('productList', productManager.getProducts());
        res.json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rutas para los productos
const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json({ products });
});

productRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    productManager.deleteProduct(productId);
    io.emit('productList', productManager.getProducts());
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.use('/api/products', productRouter);

// Rutas para los carritos
const cartRouter = express.Router();

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: productManager.getProducts() });
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('newProduct', (newProduct) => {
    try {
      const addedProduct = productManager.addProduct(newProduct);
      io.emit('productList', productManager.getProducts());
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('deleteProduct', (productId) => {
    try {
      productManager.deleteProduct(productId);
      io.emit('productList', productManager.getProducts());
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
