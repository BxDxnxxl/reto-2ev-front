<template>
    <div class="rating-box">
      <h3>Valoración</h3>
      <ul>
        <li>Historia: ⭐⭐⭐⭐⭐</li>
        <li>Jugabilidad: ⭐⭐⭐⭐✰</li>
        <li>Gráficos: ⭐⭐⭐⭐⭐</li>
        <li>Música: ⭐⭐⭐⭐⭐</li>
      </ul>
    </div>
  </template>
  
  <style scoped lang="scss">
  @import '../assets/styles/variables.scss';
  .rating-box {
    background: $background-color;
    color: $text-color;
    padding: $spacing-medium;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    margin-bottom: $spacing-large;
  
    h3 {
      color: $primary-color;
      font-size: $font-size-xlarge;
    }
  
    ul {
      list-style: none;
      padding: 0;
  
      li {
        font-size: $font-size-large;
        margin: $spacing-small 0;
      }
    }
  }
  </style>
  