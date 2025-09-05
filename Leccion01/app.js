const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');

let orderId = 1; // Para identificar los pedidos

addOrderBtn.addEventListener('click', () => {
    const order = { id: orderId++, status: 'En Proceso' };
    addOrder(order);
    processOrder(order);
});

function addOrder(order) {
    const listItem = document.createElement('li');
    listItem.id = `order-${order.id}`;
    listItem.classList.add('status-in-process'); // Añadimos una clase para estilizar el estado inicial
    listItem.textContent = `Pedido #${order.id}: ${order.status}`;
    orderList.appendChild(listItem);
}

async function processOrder(order) {
    await new Promise(resolve => {
        const preparationTime = Math.floor(Math.random() * 4000) + 2000; // Simula entre 2 y 6 segundos
        setTimeout(resolve, preparationTime); // Resuelve la promesa después de un tiempo aleatorio
    });

    order.status = 'Completado';
    updateOrderStatus(order, order.status);
}

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
