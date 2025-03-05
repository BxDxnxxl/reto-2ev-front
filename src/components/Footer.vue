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

<style>
:root {
  --form-color: #fff;
  --primary-gradient: linear-gradient(90deg, #f25421, #ff8c00, #ffd700);
  --primary-color: #f25421;
  --background-color: #fff;
  --text-color: #ffffff;
  --btn-color: #f25421;
}

.footer {
  width: 100vw;
  padding: 40px 0;
  background: #272727;
  color: var(--text-color);
  position: relative;
  bottom: 0;
  left: 0;
  margin-top: 20px;
  box-sizing: border-box;
}

.footer__content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 40px;
  flex-wrap: wrap;
}

.footer__column {
  text-align: center;
  flex: 1;
  min-width: 250px;
}

.footer__title {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.footer__icon {
  color: var(--text-color);
  font-size: 2rem;
  margin: 0 1rem;
  transition: color 0.3s;
}

.footer__icon:hover {
  color: var(--btn-color);
}

.footer__info {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.footer__button {
  background-color: #333;
  border: none;
  border-radius: 30px;
  padding: 1rem 2rem;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.footer__button:hover {
  background-color: var(--btn-color);
  color: #ffffff;
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    gap: 2rem;
    padding: 0 20px;
  }

  .footer__column {
    width: 100%;
    text-align: center;
  }
}
</style>