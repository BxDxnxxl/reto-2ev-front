<template>
    <div class="details-box">
      <h3>Detalles del juego</h3>
      <ul>
        <li><strong>Duración:</strong> 50-60 horas (historia principal)</li>
        <li><strong>Género:</strong> Acción, Aventura, Mundo Abierto</li>
        <li><strong>Plataformas:</strong> PS4, PS5, Xbox One, PC</li>
        <li><strong>Desarrollador:</strong> Rockstar Games</li>
      </ul>
    </div>
  </template>
  
  <style scoped lang="scss">
    @import '../assets/styles/variables.scss';

  .details-box {
    background: $background-color;
    color: $text-color;
    padding: $spacing-medium;
    border-radius: $border-radius;
    margin-bottom: $spacing-large;
    box-shadow: $box-shadow;
  
    h3 {
      color: $primary-color;
      font-size: $font-size-xlarge;
    }
  
    li {
      margin: $spacing-small 0;
      font-size: $font-size-base;
  
      strong {
        color: $primary-color;
      }
    }
  }
  </style>
  