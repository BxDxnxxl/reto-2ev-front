<script>
export default {
    props: {
        games: Array
    },
    methods: {
        editGame(game) {
            this.$emit('edit-game', game)
        },
        deleteGame(gameId) {
            this.$emit('delete-game', gameId)
        }
    }
}
</script>


<template>
    <div class="game-list">
        <table class="game-list__tabla">
            <thead class="game-list__encabezado">
                <tr>
                    <th class="game-list__celda">Nombre</th>
                    <th class="game-list__celda">Fecha de Lanzamiento</th>
                    <th class="game-list__celda">PEGI</th>
                    <th class="game-list__celda">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in games" :key="game.id" class="game-list__fila">
                    <td class="game-list__celda">{{ game.name }}</td>
                    <td class="game-list__celda">{{ game.year }}</td>
                    <td class="game-list__celda">{{ game.pegi }}</td>
                    <td class="game-list__celda game-list__celda--acciones">
                        <button @click="editGame(game)"
                            class="game-list__boton game-list__boton--editar">Editar</button>
                        <button @click="deleteGame(game.id)"
                            class="game-list__boton game-list__boton--eliminar">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.game-list {
    padding: $spacing-large;
    overflow-x: auto;

    &__tabla {
        width: 100%;
        border-collapse: collapse;
        font-size: $font-size-small;
        color: $text-color;
    }

    &__encabezado {
        background-color: $primary-color;
        color: $text-color;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        th {
            padding: $spacing-small;
            font-weight: 500;
        }
    }

    &__celda {
        padding: $spacing-small;
        text-align: center;
        border-bottom: 1px solid rgba($secondary-color, 0.2);
        vertical-align: middle;
        word-wrap: break-word;
        color: #000;
    }

    &__fila {
        transition: background-color 0.2s;

        &:hover {
            background-color: rgba($secondary-color, 0.05);
        }
    }

    &__celda--acciones {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: $spacing-small;
    }

    &__boton {
        padding: $spacing-small $spacing-medium;
        border-radius: $border-radius;
        cursor: pointer;
        border: none;
        transition: background-color 0.3s;
        min-width: 80px;
        text-align: center;

        &--editar {
            background-color: #1DBD00;
        }

        &--eliminar {
            background-color: #FF0000;
        }
    }

    @media (max-width: 768px) {
        &__encabezado {
            display: none;
        }

        &__celda--acciones {
            flex-direction: column;
            gap: $spacing-small;
        }
    }
}
</style>