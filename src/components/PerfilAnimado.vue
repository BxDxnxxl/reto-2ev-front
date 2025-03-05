<script>
  export default {
    data() {
      return {
        isHovered: false
      }
    }
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
  >
    <circle cx="50" cy="50" r="48" stroke="#272727" stroke-width="4" fill="#f25421"/>
    
    <circle 
      cx="50" 
      cy="35" 
      :r="isHovered ? 30 : 15" 
      fill="#272727"
      :style="{ transition: 'r 0.3s' }"
    />

    <path 
      d="M30 80 C30 60, 70 60, 70 80" 
      stroke="#272727" 
      stroke-width="4" 
      fill="#272727"
      :style="{ transform: isHovered ? 'scale(1, 0.5)' : 'scale(1, 1)', transition: 'transform 0.3s' }"
    />
  </svg>
</template>
  
<style>

</style>