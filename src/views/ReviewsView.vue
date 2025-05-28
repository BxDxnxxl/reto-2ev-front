<script setup lang="ts">
import ReviewPrincipal from '@/components/ReviewPrincipal.vue'
import GameDetails from '@/components/GameDetails.vue'
import PersonalExperience from '@/components/PersonalExperience.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const gameId = route.query.id ? Number(route.query.id) : 0
</script>

<template>
  <div class="review-page">
    <ReviewPrincipal :gameId="gameId"/>
    <GameDetails :gameId="gameId"/>
    <PersonalExperience :gameId="gameId"/>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';
.review-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-large;
  display: flex;
  flex-direction: column;
  gap: $spacing-large;
  background-color: $background-color;
}
</style>
