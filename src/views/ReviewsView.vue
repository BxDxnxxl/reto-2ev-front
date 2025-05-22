<script setup lang="ts">
import ReviewPrincipal from '@/components/ReviewPrincipal.vue'
import GameDetails from '@/components/GameDetails.vue'
import PersonalExperience from '@/components/PersonalExperience.vue'
</script>

<template>
  <div class="review-page">
    <ReviewPrincipal />
    <GameDetails />
    <PersonalExperience />
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
