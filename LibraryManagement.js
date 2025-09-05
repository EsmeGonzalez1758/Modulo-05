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

// Función para buscar libros por autor o género
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
// Ejemplo de cómo ejecutar la aplicación
mostrarLibros();
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);
actualizarDisponibilidad("1984", false);