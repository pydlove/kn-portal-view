<template>
  <div class="error-page">
    <div class="error-content">
      <img class="null-img" alt="avatar" src="@/assets/images/null.jpg" />
      <h3>Error Route Page....</h3>
    </div>
  </div>
</template>

<script setup lang="ts" name="ErrorPage"></script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .error-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: unset;
    max-height: 100%;
    h3 {
      width: 100%;
      margin-top: 20px;
      text-align: center;
      font-size: 50px;
      color: teal;
    }
    .null-img {
      display: block;
      width: 400px;
      height: 252px;
      margin: 0 auto;
    }
  }
}
</style>
