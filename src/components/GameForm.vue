<script>
export default {
    props: {
        selectedGame: Object
    },
    data() {
        return {
            form: {
                id: this.selectedGame ? this.selectedGame.id : null,
                name: this.selectedGame ? this.selectedGame.name : '',
                year: this.selectedGame ? this.selectedGame.year : '',
                pegi: this.selectedGame ? this.selectedGame.pegi : '3',
            }
        };
    },
    methods: {
        submitForm() {
            if (this.selectedGame) {
                this.$emit('update-game', { ...this.form });
            } else {
                this.$emit('add-game', { ...this.form });
            }
        },
        closeForm() {
            this.$emit('close-form');
        }
    }
}
</script>

<template>
    <div class="game-form">
        <h2 v-if="selectedGame">Editar Videojuego</h2>
        <h2 v-else>Añadir Videojuego</h2>

        <form @submit.prevent="submitForm">
            <div class="game-form__campo">
                <label for="name">Nombre del videojuego</label>
                <input v-model="form.name" id="name" type="text" placeholder="Nombre del videojuego" required />
            </div>

            <div class="game-form__campo">
                <label for="year">Fecha de lanzamiento</label>
                <input v-model="form.year" id="year" type="date" required />
            </div>

            <div class="game-form__campo">
                <label for="pegi">PEGI</label>
                <select v-model="form.pegi" id="pegi" required>
                    <option value="3">PEGI 3</option>
                    <option value="7">PEGI 7</option>
                    <option value="12">PEGI 12</option>
                    <option value="16">PEGI 16</option>
                    <option value="18">PEGI 18</option>
                </select>
            </div>

            <div class="game-form__acciones">
                <button type="submit">{{ selectedGame ? 'Actualizar' : 'Añadir' }} Videojuego</button>
                <button type="button" @click="closeForm">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.game-form {
    padding: $spacing-medium;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: $border-radius;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    h2 {
        text-align: center;
        margin-bottom: $spacing-medium;
    }

    .game-form__campo {
        margin-bottom: $spacing-medium;
    }

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input,
    select {
        width: 100%;
        padding: $spacing-small;
        border: 1px solid #ccc;
        border-radius: $border-radius;
    }

    .game-form__acciones {
        display: flex;
        justify-content: space-between;

        button {
            padding: $spacing-small;
            border: none;
            cursor: pointer;
            border-radius: $border-radius;
            transition: background-color 0.3s;

            &:first-child {
                background-color: $primary-color;
                color: $text-color;
            }

            &:last-child {
                background-color: #ccc;
            }
        }
    }

    @media (max-width: $desktop) {
        max-width: 90%;
        padding: $spacing-small;
    }
}
</style>