// Datos iniciales de libros en formato JSON
let biblioteca = {
    "libros": [
        { "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "genero": "Realismo mágico", "disponible": true },
        { "titulo": "1984", "autor": "George Orwell", "genero": "Distopía", "disponible": true }
    ]
};

// Función para simular la lectura de datos (asimilar la lectura de un archivo JSON)
function leerDatos(callback) {
    setTimeout(() => {
        // Aquí simulas leer el JSON con un retraso de 1 segundo
        callback(biblioteca);
    }, 1000);
}

// Función para mostrar todos los libros en consola
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
// Función para agregar un nuevo libro
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

// Función para cambiar la disponibilidad de un libro
function actualizarDisponibilidad(titulo, nuevoEstado) {
    // Simula un retraso antes de actualizar la disponibilidad
    setTimeout(() => {
        // Pista: busca el libro por título y cambia la propiedad 'disponible' a nuevoEstado
    }, 1000);
}

// Ejemplo de cómo ejecutar la aplicación
mostrarLibros();
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);
actualizarDisponibilidad("1984", false);