<!--
 * @Author: chenamin
 * @LastModifiedBy: chenamin
 * @Date: 2024-11-27 14:12:12
 * @LastEditTime: 2024-12-18 15:09:54
 * @FilePath: /cbdt-data-classification-categorization-front/src/layout/Footer.vue
 * @Description: file content
-->
<template>
  <footer class="footer">
    <wb-grid class="wb-grid hydrated">
      <div class="footer-left">
        <wb-text class="wb-text hydrated" size="s" tag="div">
          © {{ new Date().getFullYear() }}. Mercedes-Benz AG. All rights reserved.
        </wb-text>
      </div>
      <div class="footer-right">
        <!-- <div class="top-jump">
          <wb-text class="wb-text hydrated" size="s" tag="div">Top</wb-text
          ><wb-icon class="wb-icon hydrated" aria-hidden="true" name="bds/chevron-up/16"></wb-icon>
        </div> -->
      </div>
    </wb-grid>
  </footer>
</template>
<script setup lang="ts" name="Footer"></script>
<style lang="scss" scoped>
@use './scss/footer.scss';
</style>
