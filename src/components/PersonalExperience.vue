<script setup>
import { useReviewStore } from '@/stores/review'
const review = useReviewStore().review

</script>

<template>
    <div class="experience">
        <h3>Opinion Personal</h3>
        <p>{{ review?.opinionPersonal }}</p>
    </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.experience {
    background: $secondary-color;
    color: $text-color;
    padding: $spacing-medium;
    border-radius: $border-radius;
    margin-bottom: $spacing-large;
    box-shadow: $box-shadow;

    h3 {
        color: $primary-color;
        font-size: $font-size-xlarge;
    }

    p {
        font-size: $font-size-base;
        line-height: 1.6;
    }
}
</style>