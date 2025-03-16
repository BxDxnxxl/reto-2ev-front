<script>
export default {
  data() {
    return {
      isHovered: false,
    }
  },
}
</script>

<template>
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
    :style="{ transform: isHovered ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.3s' }"
  >
    <!-- Cabeza -->
    <circle
      cx="50"
      cy="30"
      :r="isHovered ? 18 : 15"
      fill="#f25421"
      :style="{ transition: 'r 0.3s' }"
    />

    <!-- Cuerpo -->
    <path
      d="M20 80 C20 60, 80 60, 80 80"
      fill="#f25421"
      :style="{
        transform: isHovered ? 'scale(1.1, 1.2)' : 'scale(1, 1)',
        transition: 'transform 0.3s',
      }"
    />
  </svg>
</template>
  
<style>
</style>