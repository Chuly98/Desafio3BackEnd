const express = require('express');
const {ProductManager} = require('.ProductManager')

const app = express();

const Manager = new ProductManager('./productos.json');
app.use(express.json());

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('<h1>BINVENIDO A LA PAGINA!</h1>');
});

// Ruta para obtener todos los productos o filtrar por límite
//recupera los productos del productManaher
app.get('/productos', (req, res) => {
    try {
        const { limit } = req.query;
        let productos = Manager.getProducts();

        if (limit) {
            productos = productos.slice(0, parseInt(limit));
        }

        res.json({ productos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

// Ruta para obtener un producto por pid (es el id del producto)
app.get('/productos/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const productoId = parseInt(pid);
        //uso el metodo getProductByid para buscar el producto por id
        const producto = Manager.getProductById(productoId);

        if (producto && typeof producto !== 'string') {
            res.json({ producto });
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

// Escuchando el servidor en el puerto 8080
app.listen(8080, () => {
    console.log(`Escuchando en el puerto 8080`);
});