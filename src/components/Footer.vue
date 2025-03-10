<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <link
      href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
    <div class="footer__content">
      <div class="footer__column footer__column--socials">
        <h3 class="footer__title">Redes sociales</h3>
        <a href="#" class="footer__link">
          <i class="footer__icon ri-facebook-box-fill"></i>
        </a>
        <a href="https://github.com/BxDxnxxl/reto-2ev-front.git" class="footer__link">
          <i class="footer__icon ri-github-fill"></i>
        </a>
        <a href="#" class="footer__link">
          <i class="footer__icon ri-instagram-fill"></i>
        </a>
      </div>

      <div class="footer__column footer__column--contact">
        <h3 class="footer__title">Contacto</h3>
        <p class="footer__info">+34 123456789</p>
        <p class="footer__info">WannaGames@gmail.com</p>
        <router-link to="/contact">
          <a class="footer__button ov-btn-slide-left">Contacto</a>
        </router-link>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
@import '@/assets/styles/variables.scss';


/* 🔹 Footer */
.footer {
  width: 100%;
  background: $background-color;
  color: $text-color;
  padding: $spacing-large 0;
  right: 0;
  margin-top: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  gap: $spacing-medium;
  padding: 0 $spacing-medium;
}

.footer__column {
  width: 100%;
  max-width: 300px;
}

/* 🔹 Títulos */
.footer__title {
  font-weight: bold;
  font-size: $font-size-xlarge;
  margin-bottom: $spacing-medium;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: $spacing-medium;
}

.footer__icon {
  font-size: 2rem;
  color: $text-color;
  transition: color 0.3s;

  &:hover {
    color: $primary-color;
  }
}

.footer__info {
  font-size: $font-size-large;
}

.footer__button {
  display: inline-block;
  background-color: $primary-color;
  border-radius: $border-radius;
  padding: $spacing-medium $spacing-large;
  color: $text-color;
  font-size: $font-size-base;
  font-weight: 600;
  text-decoration: none;
  box-shadow: $box-shadow;
  transition: background 0.3s;

  &:hover {
    background-color: $secondary-color;
  }
}

@media (min-width: $desktop) {
  .footer {
    width: 100%;
  }
  .footer__content {
    flex-direction: row;
    justify-content: space-around;
    text-align: left;
  }

  .footer__column {
    max-width: 400px;
  }

  .footer__links {
    justify-content: flex-start;
  }
}

@media (min-width: $laptop) {
  .footer {
    width: 100%;
  }
  .footer__content {
    max-width: 1400px;
    padding: 0 $spacing-large;
  }
}
</style>