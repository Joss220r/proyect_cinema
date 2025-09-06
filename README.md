# proyect_cinema

Cartelera — Frontend (Vue 3 + Bootstrap 5)

Tecnologías:

- Vue.js 3 (CDN) para estado, componentes reactiv@s y plantillas.
- Bootstrap 5 para diseño moderno, responsivo y accesible.
- Fetch API nativa para consumir la API.
- Sin backend adicional (solo frontend).

API base:
GET/POST/PUT/DELETE → https://movie.azurewebsites.net/api/cartelera
GET lista + filtros server-side:

- ?title=<texto>
- ?ubication=<cine>

Características:

- Búsqueda por título (servidor).
- Filtro por “Ubication” (servidor) y por “Type” (cliente).
- Toggle “Solo disponibles (Estado=true)” (cliente).
- Orden por Año asc/desc.
- Paginación cliente (12 por página).
- Modal de detalles (poster, año, género, cine y descripción).
- Panel “Modo Admin” opcional para pruebas de POST/PUT/DELETE.
- Diseño oscuro, grid responsive y tarjetas.

Cómo ejecutar:

1. Abrir index.html en el navegador.
2. Publicar: subir index.html a Netlify / GitHub Pages.
