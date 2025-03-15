<template>
  <div class="contact-form-container">
    <form action="https://formsubmit.co/wannagamessv@gmail.com" method="POST" class="contact-form">
      <div class="contact-form__header">
        <router-link to="/" class="contact-form__back-button">
          <a>&#8592;</a>
        </router-link>
        <h2 class="contact-form__title">Contacto</h2>
      </div>

      <div class="contact-form__body">
        <div class="contact-form__input-group">
          <label for="name" class="contact-form__label">Nombre</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre"
            required
            class="contact-form__input"
          />

          <label for="phone" class="contact-form__label">Teléfono</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Teléfono"
            required
            class="contact-form__input"
          />

          <label for="email" class="contact-form__label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            class="contact-form__input"
          />

          <label for="message" class="contact-form__label">Mensaje</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="5"
            placeholder="Mensaje"
            required
            class="contact-form__textarea"
          ></textarea>

          <input type="hidden" name="_next" value="https://tuweb.com/gracias.html" />
          <input type="hidden" name="_subject" value="Nuevo mensaje de contacto" />
          <input
            type="hidden"
            name="_autoresponse"
            value="Hemos recibido tu mensaje y te contactaremos pronto."
          />

          <input class="contact-form__submit" type="submit" value="Enviar" />
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.contact-form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background-color);
}

.contact-form {
  width: 100%;
  max-width: 400px;
  background-color: #272727;
  border-radius: 20px;
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact-form__header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20px;
}

.contact-form__back-button {
  font-size: 1.8rem;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
  margin-right: 10px;

  &:hover {
    color: var(--primary-color);
  }
}

.contact-form__title {
  color: var(--text-color);
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  flex-grow: 1;
}

.contact-form__body {
  width: 100%;
}

.contact-form__input-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.contact-form__label {
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.contact-form__input,
.contact-form__textarea {
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: var(--text-color);
  border: 1px solid var(--primary-color);
  color: #333;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 5px var(--primary-color);
  }

  &::placeholder {
    color: #666;
    font-size: 0.9rem;
  }
}

.contact-form__submit {
  background-color: var(--primary-color);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #f25421;
    transform: translateY(-2px);
    box-shadow: 0 0 5px var(--primary-color);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
