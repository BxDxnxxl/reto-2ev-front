<template>
    <div class="gallery">
      <h3>Capturas del juego</h3>
      <div class="images">
        <img src="https://www.rockstargames.com/reddeadredemption2/img/global/order/rdr2_pc_screenshot_1.jpg" alt="Screenshot 1">
        <img src="https://www.rockstargames.com/reddeadredemption2/img/global/order/rdr2_pc_screenshot_2.jpg" alt="Screenshot 2">
        <img src="https://www.rockstargames.com/reddeadredemption2/img/global/order/rdr2_pc_screenshot_3.jpg" alt="Screenshot 3">
      </div>
    </div>
  </template>
  <style scoped lang="scss">
  @import '../assets/styles/variables.scss';
  .gallery {
  background: $secondary-color;
  color: $text-color;
  padding: $spacing-medium;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  h3 {
    color: $primary-color;
    margin-bottom: $spacing-medium;
    font-size: $font-size-xlarge;
  }

  .images {
    display: flex;
    gap: $spacing-medium;
    flex-wrap: wrap;
    justify-content: center;

    img {
      width: 100%;
      max-width: 300px;
      border-radius: $border-radius;
      box-shadow: $box-shadow;
      object-fit: cover;
    }
  }
}
  </style>
  