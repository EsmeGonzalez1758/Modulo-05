# Simulador de Pedidos en una Cafetería

Este proyecto simula el sistema de gestión de pedidos de una cafetería moderna, donde los pedidos se reciben y procesan de forma asíncrona. La interfaz se actualiza en tiempo real para reflejar el estado de cada pedido.

## Problema

En una cafetería moderna, es común que los clientes realicen pedidos que requieren preparación mientras se reciben nuevos pedidos. Una interfaz debe mostrar los pedidos en progreso, permitir que los baristas trabajen en ellos de manera asincrónica y actualizar el estado de los pedidos en tiempo real. El desafío consiste en simular este sistema mediante JavaScript, utilizando el Event Loop y diferentes mecanismos de asincronía como `setTimeout`, Promises y `async/await`.

## Solución Implementada

La solución se estructura en tres archivos principales: `index.html` para la interfaz, `style.css` para el diseño y `app.js` para la lógica de la aplicación.

### 1. Configuración del Entorno (`index.html`)

Se crea la estructura básica de la página web. Contiene un título, un botón (`#addOrderBtn`) para generar nuevos pedidos y una lista no ordenada (`#orderList`) que servirá como contenedor para mostrar los pedidos. Finalmente, se enlaza la hoja de estilos y el script de JavaScript.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador de Pedidos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Cafetería: Simulador de Pedidos</h1>
        <button id="addOrderBtn">Agregar Pedido</button>
        <ul id="orderList"></ul>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

### 2. Estilos y Feedback Visual (`style.css`)

La hoja de estilos proporciona una apariencia agradable y, lo más importante, un feedback visual claro sobre el estado de los pedidos. Se definen clases específicas (`.status-in-process` y `.status-completed`) que cambian el color de fondo de un pedido según su estado.

```css
html, body {
    height: 100%; 
    margin: 0; 
}
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
    background-image: url('https://i.postimg.cc/7Z92QMpC/image.png');
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat; 
    color: #333;
}

.container {
    margin: 2rem; 
    background-color: rgba(244, 244, 249, 0.8); 
    padding: 1rem; 
    border-radius: 8px; 
}

h1 {
    color: #5a3e36;
}

button {
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #8c6d62;
    color: white;
    border: none;
    border-radius: 5px;
    margin-bottom: 1rem;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding: 12px;
    margin-top: 8px;
    border-radius: 5px;
    transition: background-color 0.5s ease;
}

.status-in-process {
    background-color: #ffc107; 
}

.status-completed {
    background-color: #28a745;
    color: white;
}
```

### 3. Lógica de la Aplicación (`app.js`)

Este archivo contiene el núcleo de la simulación y se divide en varias partes clave:

#### 3.1. Inicialización y Evento Principal

Primero, obtenemos las referencias a los elementos del DOM y configuramos un contador para los IDs de los pedidos. Luego, añadimos un `event listener` al botón "Agregar Pedido". Al hacer clic, se crea un nuevo objeto `order`, se muestra en la interfaz llamando a `addOrder`, y se inicia su procesamiento asíncrono con `processOrder`.

```javascript
const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');

let orderId = 1; // Para identificar los pedidos

addOrderBtn.addEventListener('click', () => {
    const order = { id: orderId++, status: 'En Proceso' };
    addOrder(order);
    processOrder(order);
});
```

#### 3.2. Añadir Pedido a la Interfaz (`addOrder`)

Esta función es responsable de la manipulación del DOM. Crea un nuevo elemento de lista (`<li>`), le asigna un ID único y una clase CSS para el estilo inicial ('En Proceso'), y lo añade a la lista de pedidos en la página.

```javascript
function addOrder(order) {
    const listItem = document.createElement('li');
    listItem.id = `order-${order.id}`;
    listItem.classList.add('status-in-process'); 
    listItem.textContent = `Pedido #${order.id}: ${order.status}`;
    orderList.appendChild(listItem);
}
```

#### 3.3. Simular Preparación Asíncrona (`processOrder`)

Aquí reside la magia de la asincronía. La función `async processOrder` utiliza `await` para esperar a que una `Promise` se resuelva. Dentro de la `Promise`, `setTimeout` simula el tiempo de preparación (entre 2 y 6 segundos). Esta operación no bloquea el hilo principal, permitiendo que se sigan añadiendo pedidos. Una vez que el tiempo pasa, la `Promise` se resuelve, y la ejecución de `processOrder` continúa.

```javascript
async function processOrder(order) {
    await new Promise(resolve => {
        const preparationTime = Math.floor(Math.random() * 4000) + 2000; // Simula entre 2 y 6 segundos
        setTimeout(resolve, preparationTime); // Resuelve la promesa después de un tiempo aleatorio
    });

    order.status = 'Completado';
    updateOrderStatus(order, order.status);
}
```

#### 3.4. Actualizar Estado del Pedido (`updateOrderStatus`)

Cuando `processOrder` termina, llama a esta función. `updateOrderStatus` busca el elemento del pedido en el DOM por su ID, actualiza su texto para mostrar el estado "Completado" y cambia sus clases CSS para darle el color verde correspondiente, proporcionando un feedback visual claro al usuario.

```javascript
function updateOrderStatus(order, status) {
    const listItem = document.getElementById(`order-${order.id}`);
    if (listItem) {
        listItem.textContent = `Pedido #${order.id}: ${status}`;
        if (status === 'Completado') {
            listItem.classList.remove('status-in-process');
            listItem.classList.add('status-completed');
        }
    }
}
```

### Cómo Ejecutar

1.  Guarda los tres archivos (`index.html`, `style.css`, `app.js`) en la misma carpeta.
2.  Abre el archivo `index.html` en tu navegador web.
[![image.png](https://i.postimg.cc/SKZtq9zR/image.png)](https://postimg.cc/3yvZFd1Q)
3.  Haz clic en el botón "Agregar Pedido" para ver la simulación en acción.
[![image.png](https://i.postimg.cc/prj0D1c5/image.png)](https://postimg.cc/GTcJRzCb)
4. Al darle click a agregar pedido hara que en 2 y 6 minutos una simulacion para despues completarse.
[![image.png](https://i.postimg.cc/SsBdNfQS/image.png)](https://postimg.cc/xJPM6Hbh)
