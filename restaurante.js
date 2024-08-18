// Definición de productos por categoría
const productos = {
    entrada: [
        { nombre: 'Ensalada César', precio: 5.00 },
        { nombre: 'Sopa de Tomate', precio: 4.50 },
        { nombre: 'Bruschetta', precio: 6.00 }
    ],
    platoPrincipal: [
        { nombre: 'Pizza Margarita', precio: 10.00 },
        { nombre: 'Hamburguesa con Papas', precio: 12.00 },
        { nombre: 'Pasta Carbonara', precio: 11.00 }
    ],
    postre: [
        { nombre: 'Tiramisú', precio: 4.00 },
        { nombre: 'Brownie', precio: 4.50 },
        { nombre: 'Helado', precio: 3.50 }
    ]
};

// Lista de pedidos
const pedidos = [];

// Función para actualizar el menú de productos según el tipo seleccionado
function actualizarMenuProductos(tipo) {
    const productoSelect = document.getElementById('producto');
    productoSelect.innerHTML = '<option value="" disabled selected>Seleccione un producto</option>';
    
    if (tipo) {
        productos[tipo].forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.nombre;
            option.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
            productoSelect.appendChild(option);
        });
    }
}

// Función para añadir un pedido
function añadirPedido(mesa, tipo, producto) {
    if (!mesa || !tipo || !producto) return;

    const nuevoPedido = {
        mesa: parseInt(mesa, 10),
        items: [{ tipo, nombre: producto }]
    };

    // Buscar si ya existe un pedido para esa mesa
    const mesaExistente = pedidos.find(pedido => pedido.mesa === nuevoPedido.mesa);
    if (mesaExistente) {
        mesaExistente.items.push(nuevoPedido.items[0]);
    } else {
        pedidos.push(nuevoPedido);
    }
}

// Función para mostrar los pedidos realizados
function mostrarPedidos() {
    const pedidosContainer = document.getElementById('pedidosContainer');
    let html = '<h2>Listado de Pedidos:</h2>';
    pedidos.forEach(pedido => {
        html += `<h3>Mesa ${pedido.mesa}:</h3><ul>`;
        pedido.items.forEach(item => html += `<li>${item.tipo}: ${item.nombre}</li>`);
        html += `</ul><p>Total a Pagar: $${calcularTotal(pedido).toFixed(2)}</p>`;
    });
    pedidosContainer.innerHTML = html;
}

// Función para calcular el total a pagar por un pedido
function calcularTotal(pedido) {
    return pedido.items.reduce((total, item) => {
        const producto = productos[item.tipo].find(p => p.nombre === item.nombre);
        return total + (producto ? producto.precio : 0);
    }, 0);
}

// Función para mostrar acumulado de ingresos por tipo de comida
function ingresosPorTipo() {
    const ingresos = { entrada: 0, platoPrincipal: 0, postre: 0 };
    
    pedidos.forEach(pedido => {
        pedido.items.forEach(item => {
            const producto = productos[item.tipo].find(p => p.nombre === item.nombre);
            if (producto) {
                ingresos[item.tipo] += producto.precio;
            }
        });
    });

    const ingresosContainer = document.getElementById('ingresosContainer');
    let html = '<h2>Acumulado de Ingresos por Tipo de Comida:</h2>';
    Object.entries(ingresos).sort((a, b) => b[1] - a[1]).forEach(([tipo, total]) => {
        html += `<p>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: $${total.toFixed(2)}</p>`;
    });
    ingresosContainer.innerHTML = html;
}

// Función para mostrar cantidad de pedidos por mesa
function pedidosPorMesa() {
    const cantidadPedidos = pedidos.reduce((acc, pedido) => {
        acc[pedido.mesa] = (acc[pedido.mesa] || 0) + 1;
        return acc;
    }, {});

    const pedidosPorMesaContainer = document.getElementById('pedidosPorMesaContainer');
    let html = '<h2>Cantidad de Pedidos por Mesa:</h2>';
    Object.entries(cantidadPedidos).sort((a, b) => b[1] - a[1]).forEach(([mesa, cantidad]) => {
        html += `<p>Mesa ${mesa}: ${cantidad} pedido(s)</p>`;
    });
    pedidosPorMesaContainer.innerHTML = html;
}

// Manejar el envío del formulario
document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mesa = document.getElementById('mesa').value;
    const tipo = document.getElementById('tipo').value;
    const producto = document.getElementById('producto').value;

    añadirPedido(mesa, tipo, producto);
    mostrarPedidos();
    ingresosPorTipo();
    pedidosPorMesa();
});

// Actualizar productos al cambiar el tipo
document.getElementById('tipo').addEventListener('change', function() {
    const tipo = this.value;
    actualizarMenuProductos(tipo);
});

// Inicializar el menú de productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenuProductos(document.getElementById('tipo').value);
});
