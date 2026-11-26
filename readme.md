# A Tu Vista · Accesibilidad visual

Prototipo de interfaz web accesible diseñado para personas con baja visión, enfocado en el reconocimiento visual, la descripción mediante voz y el acceso sencillo a documentos importantes.

## Funcionalidades principales

1. **Reconocimiento de productos:** Vista previa de cámara y botón **Play** con icono de altavoz para iniciar o detener la lectura descriptiva por voz.
2. **Personas, paisajes y colores:** Vista previa de cámara con indicadores de color (verde, morado y naranja) y botón **Play** con altavoz para reproducir descripciones del entorno.
3. **Documentos importantes:** Cuadrícula paginada de documentos (3 elementos por página, de 9 disponibles), vista de detalle y reproducción/lectura en voz alta mediante síntesis de voz del navegador (`speechSynthesis`).

## Navegación y accesibilidad

- **Cambio de pantalla:** Puedes deslizar horizontalmente en pantallas táctiles, usar las flechas `←` y `→` del teclado o pulsar los controles de navegación inferiores.
- **Ayuda:** El botón `?` en la cabecera abre un diálogo con instrucciones de uso.
- **Tipografía y contraste:** Utiliza *Atkinson Hyperlegible*, botones de gran tamaño, estados visibles al enfocar (`focus-visible`) y respeta `prefers-reduced-motion`.

## Estructura del proyecto

- `index.html`: Estructura principal de la aplicación y las tres pantallas funcionales.
- `css/styles.css`: Estilos visuales, diseño adaptable (escritorio, tablet y móvil) y paletas diferenciadas por funcionalidad.
- `js/app.js`: Lógica de desplazamiento entre pantallas, paginación y vista de documentos, ventana de ayuda y lectura por voz.
- `logotipo.jpeg`: Logotipo institucional mostrado en la cabecera.

## Ejecución local

No requiere instalación de dependencias ni compilación. Puedes abrir `index.html` directamente en un navegador web o servir la carpeta con un servidor local estático (por ejemplo, *Live Server* en VS Code o `npx serve`).

> **Nota:** Esta versión corresponde a la maqueta de interfaz; la conexión con cámara en tiempo real, modelos de reconocimiento y repositorios de documentos debe integrarse con los servicios correspondientes.