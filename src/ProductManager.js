const fs = require('fs');

class Product {
    constructor(nombre, precio, thumbnail, descripcion, code, stock) {
        this.id = null;
        this.nombre = nombre;
        this.precio = precio;
        this.thumbnail = thumbnail;
        this.descripcion = descripcion;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productos = [];
        this.nextId = 1;

        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.productos = JSON.parse(data);
            if (this.productos.length > 0) {
                const maxId = Math.max(...this.productos.map(prod => prod.id));
                this.nextId = maxId + 1;
            }
        } catch (error) {
            // Si ocurre un error al cargar el archivo, simplemente seguimos con nextId en 1
        }
    }

    _guardarProductosEnArchivo() {
        try {
            const data = JSON.stringify(this.productos, null, 2);
            fs.writeFileSync(this.path, data);
        } catch (error) {
            console.error('Error al guardar los productos en el archivo:', error);
        }
    }

    agregarProducto(producto) {
        const codigoExistente = this.productos.some(prod => prod.code === producto.code);
        if (codigoExistente) {
            console.log(`Error: El código "${producto.code}" ya está en uso.`);
            return;
        }

        producto.id = this.nextId;
        this.nextId++;

        this.productos.push(producto);

        // Guardar productos en el archivo después de agregar uno
        this._guardarProductosEnArchivo();
    }

    getProducts() {
        return this.productos;
    }

    getProductById(id) {
        const productoEncontrado = this.productos.find(prod => prod.id === id);
        if (productoEncontrado) {
            return productoEncontrado;
        } else {
            return "El producto no existe.";
        }
    }

    updateProduct(id, updatedFields) {
        const productoIndex = this.productos.findIndex(prod => prod.id === id);

        if (productoIndex === -1) {
            console.log(`Error: No se encontró un producto con el ID ${id}.`);
            return;
        }

        const productoExistente = this.productos[productoIndex];

        for (const field in updatedFields) {
            if (field in productoExistente) {
                productoExistente[field] = updatedFields[field];
            } else {
                console.log(`Error: El campo "${field}" no es válido.`);
            }
        }

        // Actualizar el producto en la lista de productos y guardar en el archivo
        this.productos[productoIndex] = productoExistente;
        this._guardarProductosEnArchivo();

        console.log(`Producto con ID ${id} actualizado.`);
    }

    deleteProduct(id) {
        const productoIndex = this.productos.findIndex(prod => prod.id === id);

        if (productoIndex === -1) {
            console.log(`Error: No se encontró un producto con el ID ${id}.`);
            return;
        }

        // Eliminar el producto de la lista de productos y guardar en el archivo
        this.productos.splice(productoIndex, 1);
        this._guardarProductosEnArchivo();

        console.log(`Producto con ID ${id} eliminado.`);
    }
}

module.exports = { ProductManager, Product };