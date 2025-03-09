<template>
  <div class="logo__wrapper">
    <canvas
      ref="logoCanvas"
      :width="canvasSize"
      :height="canvasSize"
      @mouseenter="startAnimation"
      @mouseleave="resetAnimation"
      class="logo__canvas"
    ></canvas>
    <img :src="logoNameSrc" class="logo__name" alt="Logo Name" />
  </div>
</template>

<script>
export default {
  props: {
    canvasSize: {
      type: Number,
      default: 120,
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      images: [],
      imagesLoaded: 0,
      isAnimating: false,
      animationState: 0,
      separationDistance: 10,
      animationSpeed: 0.08,
      animationProgress: 0,

      logoPartsSrc: [
        new URL('@/assets/img/logo-part1.png', import.meta.url).href,
        new URL('@/assets/img/logo-part2.png', import.meta.url).href,
        new URL('@/assets/img/logo-part3.png', import.meta.url).href,
        new URL('@/assets/img/logo-part4.png', import.meta.url).href,
      ],
      logoNameSrc: new URL('@/assets/img/logo-name.png', import.meta.url).href,
    }
  },
  mounted() {
    this.canvas = this.$refs.logoCanvas
    this.ctx = this.canvas.getContext('2d')

    this.logoPartsSrc.forEach((src, index) => {
      const img = new Image()
      img.onload = () => {
        this.imagesLoaded++
        if (this.imagesLoaded === this.logoPartsSrc.length) {
          this.drawLogo(0)
        }
      }
      img.src = src
      this.images[index] = img
    })
  },
  methods: {
    startAnimation() {
      this.isAnimating = true
      this.animationState = 1
      this.animate()
    },

    resetAnimation() {
      this.isAnimating = true
      this.animationState = 0
      this.animate()
    },

    animate() {
      if (!this.isAnimating) return

      if (this.animationState === 1) {
        this.animationProgress += this.animationSpeed
        if (this.animationProgress >= 1) {
          this.animationProgress = 1
          this.isAnimating = false
        }
      } else {
        this.animationProgress -= this.animationSpeed
        if (this.animationProgress <= 0) {
          this.animationProgress = 0
          this.isAnimating = false
        }
      }

      this.drawLogo(this.animationProgress)

      if (this.isAnimating) {
        requestAnimationFrame(this.animate)
      }
    },

    drawLogo(progress) {
      if (this.imagesLoaded < 4) return

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      const width = this.canvas.width
      const height = this.canvas.height
      const halfWidth = width / 2
      const halfHeight = height / 2
      const easeProgress = this.easeInOutQuad(progress)
      const offset = this.separationDistance * easeProgress

      this.ctx.drawImage(this.images[0], 0 - offset, 0 - offset, halfWidth, halfHeight)
      this.ctx.drawImage(this.images[1], halfWidth + offset, 0 - offset, halfWidth, halfHeight)
      this.ctx.drawImage(this.images[2], 0 - offset, halfHeight + offset, halfWidth, halfHeight)
      this.ctx.drawImage(
        this.images[3],
        halfWidth + offset,
        halfHeight + offset,
        halfWidth,
        halfHeight
      )
    },

    easeInOutQuad(x) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__canvas {
    cursor: pointer;
    width: 120px;
    height: 120px;
  }

  &__name {
    margin-top: 10px;
    width: 120px;
  }
}
</style>
