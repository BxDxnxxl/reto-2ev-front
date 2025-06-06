import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Review } from '@/stores/dtos/Review.dto'

const API_URL = 'https://wannagamesapi.retocsv.es/api/Review'

export const useReviewStore = defineStore('review', () => {

  const review = ref<Review | null>(null)
  const isLoading = ref(false)


  const getReviewByVideojuego = async (id: number) => {
    isLoading.value = true
    try {
      const response = await fetch(`https://wannagamesapi.retocsv.es/api/Review/videojuego/${id}`)
      if (!response.ok) throw new Error('Error al obtener la review')
      const data = await response.json()
      review.value = data
    } catch (error) {
      console.error('Error al obtener la review:', error)
    } finally {
      isLoading.value = false
    }
  }


  const postOrUpdateReview = async (newReview: Review) => {
    isLoading.value = true
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      })
      if (!response.ok) throw new Error('Error al guardar la review')
      const data = await response.json()
      review.value = data
      return true
    } catch (error) {
      console.error('Error al guardar la review:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    review,
    isLoading,
    getReviewByVideojuego,
    postOrUpdateReview,
  }
})
