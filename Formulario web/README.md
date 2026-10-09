# Formulario web

Proyecto de práctica que implementa una interfaz adaptable de registro e inicio de sesión, con diseño inspirado en paneles de autenticación modernos y validaciones en el navegador.

## Tecnologías utilizadas

- HTML5 para la estructura y los controles del formulario.
- CSS3 para los estilos, el diseño con CSS Grid y la adaptación a pantallas pequeñas.
- JavaScript para la manipulación del DOM, los eventos y las validaciones.

## Funcionalidades

- Cambio interactivo entre los modos de registro e inicio de sesión.
- Campos de registro para nombre, correo electrónico, contraseña, edad, teléfono, país o región y aceptación de términos; el inicio de sesión solicita correo y contraseña.
- Validación de campos obligatorios, formato del correo, contraseña de al menos 8 caracteres, edad entre 18 y 100 años y teléfono de 7 a 15 dígitos.
- Mensajes de error asociados a cada campo, fortaleza de contraseña en tiempo real y control para mostrar u ocultar la contraseña.
- Mensajes de resultado accesibles y transiciones animadas entre formularios.
- Validación al salir del campo (`blur`), al escribir (`input`), al cambiar una opción (`change`) y al enviar (`submit`).
- Diseño adaptable a dispositivos móviles y escritorio.

## Cómo ejecutar

Abre `index.html` en un navegador web. No requiere instalación ni servidor.

El formulario es una demostración: valida los datos localmente y no los guarda ni los envía a un servidor.
