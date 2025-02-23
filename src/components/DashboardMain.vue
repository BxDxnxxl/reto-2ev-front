<template>
  <div class="main-content">
    <div class="main-content__grid">
      <div class="main-content__item" v-for="n in 6" :key="n"></div>
    </div>
  </div>
</template>
  
  
  <style lang="scss" scoped>
.main-content {
  flex: 1;
  padding: 20px;
  background: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #34495e;
  margin-left: 0;

  @media (min-width: 768px) {
    margin-left: 250px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 1100px;
  }

  &__item {
    background: white;
    height: 150px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
  