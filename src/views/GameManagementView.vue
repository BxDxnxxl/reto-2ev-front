<template>
  <div class="game-management">
    <button class="game-management__boton-agregar" @click="showForm('add')">Añadir Videojuego</button>
    <game-form v-if="showAddEditForm" :selectedGame="selectedGame" @add-game="addGame" @update-game="updateGame"
      @close-form="closeForm" />
    <game-list :games="games" @edit-game="showForm('edit', $event)" @delete-game="deleteGame" />
  </div>
</template>

<script>
import GameForm from "@/components/GameForm.vue";
import GameList from "@/components/GameList.vue";

export default {
  components: {
    GameForm,
    GameList
  },
  data() {
    return {
      showAddEditForm: false,
      selectedGame: null,
      games: [
        { id: 1, name: 'The Witcher 3', year: '2025-03-14', pegi: '18' },
        { id: 2, name: 'Cyberpunk 2077', year: '2025-03-14', pegi: '18' },
        { id: 3, name: 'Red Dead Redemption 2', year: '2025-03-14', pegi: '18' },
        { id: 4, name: 'Grand Theft Auto V', year: '2025-03-14', pegi: '18' },
        { id: 5, name: 'Minecraft', year: '2025-03-14', pegi: '7' },
        { id: 6, name: 'The Elder Scrolls V: Skyrim', year: '2025-03-14', pegi: '16' },
        { id: 7, name: 'Dark Souls III', year: '2025-03-14', pegi: '16' },
        { id: 8, name: 'Sekiro: Shadows Die Twice', year: '2025-03-14', pegi: '18' },
        { id: 9, name: 'Overwatch', year: '2025-03-14', pegi: '12' },
        { id: 10, name: 'Fortnite', year: '2025-03-14', pegi: '12' },
        { id: 11, name: 'Apex Legends', year: '2025-03-14', pegi: '12' },
        { id: 12, name: 'Call of Duty: Warzone', year: '2025-03-14', pegi: '18' },
        { id: 13, name: 'Horizon Zero Dawn', year: '2025-03-14', pegi: '16' },
        { id: 14, name: 'Assassin\'s Creed Odyssey', year: '2025-03-14', pegi: '18' },
        { id: 15, name: 'The Last of Us Part II', year: '2025-03-14', pegi: '18' },
        { id: 16, name: 'Battlefield V', year: '2025-03-14', pegi: '16' },
        { id: 17, name: 'Madden NFL 23', year: '2025-03-14', pegi: '12' },
        { id: 18, name: 'FIFA 22', year: '2025-03-14', pegi: '3' },
        { id: 19, name: 'Far Cry 6', year: '2025-03-14', pegi: '18' },
        { id: 20, name: 'Spider-Man: Miles Morales', year: '2025-03-14', pegi: '12' },
        { id: 21, name: 'The Legend of Zelda: Breath of the Wild', year: '2025-03-14', pegi: '7' },
        { id: 22, name: 'Super Smash Bros. Ultimate', year: '2025-03-14', pegi: '7' },
        { id: 23, name: 'Halo Infinite', year: '2025-03-14', pegi: '16' },
        { id: 24, name: 'Resident Evil Village', year: '2025-03-14', pegi: '18' },
        { id: 25, name: 'Final Fantasy VII Remake', year: '2025-03-14', pegi: '16' },
        { id: 26, name: 'Doom Eternal', year: '2025-03-14', pegi: '18' },
        { id: 27, name: 'The Division 2', year: '2025-03-14', pegi: '18' },
        { id: 28, name: 'Watch Dogs: Legion', year: '2025-03-14', pegi: '18' },
        { id: 29, name: 'Minecraft Dungeons', year: '2025-03-14', pegi: '7' },
        { id: 30, name: 'Ghost of Tsushima', year: '2025-03-14', pegi: '18' }
      ]
    };
  },
  methods: {
    showForm(type, game = null) {
      if (type === 'edit') {
        this.selectedGame = { ...game };
      } else {
        this.selectedGame = null;
      }
      this.showAddEditForm = true;
    },
    closeForm() {
      this.showAddEditForm = false;
      this.selectedGame = null;
    },
    addGame(newGame) {
      this.games.push(newGame);
      this.closeForm();
    },
    updateGame(updatedGame) {
      const index = this.games.findIndex(game => game.id === updatedGame.id);
      if (index !== -1) {
        this.games[index] = updatedGame;
      }
      this.closeForm();
    },
    deleteGame(gameId) {
      this.games = this.games.filter(game => game.id !== gameId);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.game-management {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__boton-agregar {
    background-color: $primary-color;
    color: $text-color;
    padding: $spacing-medium;
    font-size: $font-size-large;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-bottom: $spacing-large;
    width: 100%;
    max-width: 300px;
    text-align: center;

    @media (max-width: $desktop) {
      max-width: 80%;
      padding: $spacing-small;
      font-size: $font-size-base;
    }
  }
}
</style>
