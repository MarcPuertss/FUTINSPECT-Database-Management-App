# FUTINSPECT - Database Management App

FUTINSPECT es una aplicación de gestión de datos del entorno futbolístico. Está orientada a mostrar información estructurada sobre jugadores, estadios, árbitros, partidos, competiciones y clubes.

El código contenido en este repositorio **no constituye una aplicación ejecutable completa**, sino que ofrece fragmentos en uso organizados por componentes, clases y vistas que reflejan la estructura real del sistema.  
**No es posible clonar y ejecutar directamente este repositorio.**

---

## Estructura del Proyecto

Cada entidad está organizada en tres archivos principales:

- `JugadorCard.js`: componente que muestra una tarjeta con información resumida del jugador.
- `JugadorDetail.js`: vista detallada con toda la información del jugador seleccionado.
- `JugadorPage.js`: página principal que lista todos los jugadores disponibles.

Esta misma estructura se replica para otras entidades como:

- `EstadioCard.js`, `EstadioDetail.js`, `EstadioPage.js`
- `ArbitroCard.js`, `ArbitroDetail.js`, `ArbitroPage.js`
- `ClubCard.js`, `ClubDetail.js`, `ClubPage.js`
- `CompeticioCard.js`, `CompeticioDetail.js`, `CompeticioPage.js`
- `PartitCard.js`, `PartitDetail.js`, `PartitPage.js`

Además, existe una `HomePage.js` que actúa como página de inicio, mostrando elementos destacados de cada categoría.

---

## Modos de Acceso

La aplicación contempla dos tipos de usuario:

### Usuario normal
- Accede directamente a la aplicación.
- Solo puede **consultar** la información.
- Visualiza la `HomePage.js` y las vistas de cada entidad (`Page`, `Card`, `Detail`).

### Usuario administrador
- Accede mediante login en la ruta `/admin`.
- Tras autenticarse, ve la misma aplicación, pero con la posibilidad de realizar **operaciones CRUD** sobre todos los elementos (crear, editar, eliminar, etc.).

---

## Video de Demostración

[![Ver video](https://img.youtube.com/vi/HJHnD4zs4EM/maxresdefault.jpg)](https://youtu.be/HJHnD4zs4EM)

> Haz clic en la imagen para ver una demostración completa del funcionamiento de FUTINSPECT, incluyendo el modo usuario y el modo administrador.

---

## Autor

Marc Puertas

[https://github.com/MarcPuertss](https://github.com/MarcPuertss)

---

