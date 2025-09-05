# Gestión de una Biblioteca de Libros: Proyecto Callbacks and JSON

Este proyecto es una aplicación de consola que simula la gestión del inventario de una pequeña biblioteca. Para ello, utiliza un objeto **JSON** como base de datos en memoria y gestiona las operaciones de lectura y escritura de forma asíncrona mediante **callbacks**.

El objetivo principal es demostrar cómo se pueden orquestar tareas que no son instantáneas (como acceder a un archivo o una base de datos) en JavaScript, asegurando que el programa no se bloquee y que las operaciones se ejecuten en el orden correcto.

## Problema

Una biblioteca local necesita una aplicación para gestionar su inventario. Los requisitos son:
*   Almacenar información de los libros: `título`, `autor`, `género` y `disponible`.
*   Ofrecer opciones para consultar el inventario, agregar nuevos libros y actualizar la disponibilidad.
*   Utilizar un formato similar a JSON para los datos.
*   Manejar las operaciones de lectura y escritura de forma asíncrona mediante **callbacks**.

---

## Solución Implementada

El script `LibraryManagement.js` implementa una solución completa que cumple con todos los requisitos. A continuación se detalla cómo se abordó cada punto.

### 1. Creación de un Objeto JSON

El script inicia con una variable `biblioteca`, que es un objeto de JavaScript que actúa como nuestra base de datos en memoria. Su estructura imita la de un archivo JSON y contiene una colección inicial de libros.

```javascript
// Datos iniciales de libros en formato JSON
let biblioteca = {
    "libros": [
        { "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "genero": "Realismo mágico", "disponible": true },
        { "titulo": "1984", "autor": "George Orwell", "genero": "Distopía", "disponible": true }
    ]
};
```

### 2. Simulación de Lectura de Datos (Asíncrona)

La función `leerDatos` simula la lectura de un archivo. Utiliza `setTimeout` para introducir un retraso de 1 segundo. Una vez transcurrido el tiempo, invoca la función `callback` que se le pasó como argumento, entregándole los datos de la biblioteca. Esto simula una operación de I/O (Entrada/Salida) no bloqueante.

```javascript
function leerDatos(callback) {
    setTimeout(() => {
        console.log("📖 Leyendo datos de la biblioteca...");
        callback(biblioteca);
    }, 1000);
}

```

### 3. Funciones para Interactuar con el Inventario

Se crearon varias funciones para manipular los datos de la biblioteca. Cada una de ellas es asíncrona y utiliza `leerDatos` y `escribirDatos` para operar sobre el inventario.

#### `mostrarLibros()`
Esta función no toma argumentos. Llama a `leerDatos` y, una vez que los datos son recibidos (dentro del callback), recorre el array `libros` con `forEach`. Para cada libro, formatea una salida legible que incluye el título, autor, género y su estado de disponibilidad, usando un operador ternario para mostrar '✅ Disponible' o '❌ Prestado'.

```javascript
function mostrarLibros() {
    leerDatos((datos) => {
        console.log("\n══════════════════════════════════════════════════════════");
        console.log("               📚 INVENTARIO DE LIBROS 📚");
        console.log("══════════════════════════════════════════════════════════");
        
        if (datos.libros.length === 0) {
            console.log("            No hay libros en el inventario");
        } else {
            datos.libros.forEach((libro, index) => {
                const estado = libro.disponible ? "✅ Disponible" : "❌ Prestado";
                console.log(` ${index + 1}. ${libro.titulo}`);
                console.log(`    👤 Autor: ${libro.autor}`);
                console.log(`    📖 Género: ${libro.genero}`);
                console.log(`    📍 Estado: ${estado}`);
                console.log("──────────────────────────────────────────────────────");
            });
        }
        console.log("══════════════════════════════════════════════════════════\n");
    });
}
```

#### `agregarLibro(..., callback)`
Esta función es un excelente ejemplo de operaciones asíncronas anidadas. Primero, llama a `leerDatos`. Dentro de su callback, busca si ya existe un libro con el mismo título y autor para evitar duplicados. Si no existe, añade el `nuevoLibro` al array. Finalmente, llama a `escribirDatos` para "guardar" los cambios. El `callback` final de `agregarLibro` solo se ejecuta una vez que la escritura ha terminado, asegurando que la siguiente operación no comience prematuramente.

```javascript
function agregarLibro(titulo, autor, genero, disponible, callback) {
    console.log(`\n➕ Agregando nuevo libro: "${titulo}"`);
    
    const nuevoLibro = { titulo, autor, genero, disponible };
    leerDatos((datos) => {
        // Verificar si el libro ya existe
        const libroExistente = datos.libros.find(libro =>
            libro.titulo.toLowerCase() === titulo.toLowerCase() &&
            libro.autor.toLowerCase() === autor.toLowerCase()
        );
        
        if (libroExistente) {
            console.log(`❌ El libro "${titulo}" de ${autor} ya existe en el inventario.`);
            if (callback) callback();
            return;
        }
        
        datos.libros.push(nuevoLibro);
        escribirDatos(datos, () => {
            console.log(`✅ Libro "${titulo}" agregado exitosamente.`);
            if (callback) callback();
        });
    });
}
```

#### `actualizarDisponibilidad(..., callback)`
Funciona de manera similar a `agregarLibro`. Llama a `leerDatos`, busca el libro por título usando `findIndex`. Si lo encuentra, modifica la propiedad `disponible`. Luego, invoca a `escribirDatos` para persistir el cambio. El `callback` se ejecuta al final para señalar que la actualización fue completada.

```javascript
function actualizarDisponibilidad(titulo, nuevoEstado, callback) {
    console.log(`\n🔄 Actualizando disponibilidad de: "${titulo}"`);
    
    leerDatos((datos) => {
        const libroIndex = datos.libros.findIndex(libro => 
            libro.titulo.toLowerCase() === titulo.toLowerCase()
        );
        
        if (libroIndex !== -1) {
            const estadoAnterior = datos.libros[libroIndex].disponible;
            datos.libros[libroIndex].disponible = nuevoEstado;
            
            escribirDatos(datos, () => {
                const nuevoEstadoTexto = nuevoEstado ? "disponible" : "prestado";
                const estadoAnteriorTexto = estadoAnterior ? "disponible" : "prestado";
                console.log(`✅ Disponibilidad de "${titulo}" cambiada de ${estadoAnteriorTexto} a ${nuevoEstadoTexto}.`);
                if (callback) callback();
            });
        } else {
            console.log(`❌ Error: Libro con título "${titulo}" no encontrado.`);
            if (callback) callback();
        }
    });
}
```

#### `buscarLibros(termino, tipo)`
Esta función permite filtrar el inventario. Llama a `leerDatos` y, en su callback, utiliza el método `filter` sobre el array de libros. Dependiendo del `tipo` ('autor' o 'genero'), filtra los resultados y los muestra en un formato similar a `mostrarLibros`.

```javascript
function buscarLibros(termino, tipo) {
    console.log(`\n🔍 Buscando libros por ${tipo}: "${termino}"`);
    
    leerDatos((datos) => {
        const resultados = datos.libros.filter(libro => {
            if (tipo === 'autor') {
                return libro.autor.toLowerCase().includes(termino.toLowerCase());
            } else if (tipo === 'genero') {
                return libro.genero.toLowerCase().includes(termino.toLowerCase());
            }
            return false;
        });
        
        console.log("\n══════════════════════════════════════════════════════════");
        console.log(`         📚 RESULTADOS DE BÚSQUEDA (${tipo}: "${termino}")`);
        console.log("══════════════════════════════════════════════════════════");
        
        if (resultados.length === 0) {
            console.log(`            No se encontraron libros con ${tipo}: "${termino}"`);
        } else {
            resultados.forEach((libro, index) => {
                const estado = libro.disponible ? "✅ Disponible" : "❌ Prestado";
                console.log(` ${index + 1}. ${libro.titulo}`);
                console.log(`    👤 Autor: ${libro.autor}`);
                console.log(`    📖 Género: ${libro.genero}`);
                console.log(`    📍 Estado: ${estado}`);
                console.log("──────────────────────────────────────────────────────");
            });
        }
        console.log("══════════════════════════════════════════════════════════\n");
    });
}
```

### 4. Simulación de Escritura en JSON (Opcional)

De manera similar a la lectura, la función `escribirDatos` simula una operación de escritura asíncrona. Recibe los nuevos datos, espera 1 segundo y luego actualiza la variable `biblioteca` global. Al finalizar, ejecuta un `callback` para señalar que la "escritura" ha terminado.

Esta función es utilizada por `agregarLibro` y `actualizarDisponibilidad` para persistir los cambios.

```javascript
function escribirDatos(nuevosDatos, callback) {
    setTimeout(() => {
        console.log("💾 Guardando datos en la biblioteca...");
        biblioteca = nuevosDatos;
        if (callback) {
            callback();
        }
    }, 1000);
}
```

---

## Cómo Ejecutar el Script

Para ver el sistema en acción, necesitas tener Node.js instalado en tu sistema.

1.  Abre una terminal o línea de comandos.
2.  Navega hasta el directorio donde se encuentra el archivo `LibraryManagement.js`.
    ```bash
    cd ruta/a/tu/proyecto/Leccion02
    ```
3.  Ejecuta el script con el siguiente comando:
    ```bash
    node LibraryManagement.js
    ```

Verás en la consola cómo se ejecutan las operaciones en secuencia, con pausas entre ellas, mostrando el estado del inventario en cada paso: inicial, después de agregar un libro, después de actualizar uno y, finalmente, tras realizar una búsqueda. La anidación de `setTimeout` y callbacks en la parte final del script demuestra cómo se puede orquestar una serie de tareas asíncronas.
[![image.png](https://i.postimg.cc/5tbGDNvt/image.png)](https://postimg.cc/4Y2B9GWC)

[![image.png](https://i.postimg.cc/5tgGJdqS/image.png)](https://postimg.cc/7CCX1RR5)

[![image.png](https://i.postimg.cc/SN8mhRXL/image.png)](https://postimg.cc/3dKsjKFW)

[![image.png](https://i.postimg.cc/rFS2HHbQ/image.png)](https://postimg.cc/ppXShsPF)