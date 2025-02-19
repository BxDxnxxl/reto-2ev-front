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
        <a href="" class="footer__button ov-btn-slide-left">Contacto</a>
      </router-link>
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
  width: 100%;
  padding: 20px;
  background: #272727;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: absolute;
  bottom: 0;
  left: 0;
}

.footer__column {
  text-align: center;
}

.footer__title {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.footer__icon {
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 0 0.5rem;
  transition: color 0.3s;
}

.footer__icon:hover {
  color: var(--btn-color);
}

.footer__info {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.footer__button {
  background-color: #333;
  border: none;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  display: inline-block;
}

.footer__button:hover {
  background-color: var(--btn-color);
  color: #ffffff;
}

.footer__button::after {
  content: '';
  background: var(--btn-color);
  position: absolute;
  z-index: -1;
  padding: 16px 20px;
  display: block;
  top: 0;
  bottom: 0;
  left: -100%;
  right: 100%;
  transition: all 0.35s;
}

.footer__button:hover::after {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transition: all 0.35s;
}

@media (min-width: 768px) {
  .footer {
    flex-direction: row;
    justify-content: space-around;
    padding: 2rem 4rem;
    text-align: center;
  }

  .footer__column {
    max-width: 300px;
  }

  .footer__icon {
    font-size: 2rem;
    margin: 0 1rem;
  }

  .footer__title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .footer__button {
    font-size: 1.1rem;
    padding: 1rem 2rem;
  }
}
</style>
