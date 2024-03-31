<script setup lang="ts">
import { cookbookStates } from "../core";

const switchOrigin = async () => {
  cookbookStates.window.enableOriginSelector = true;
};
</script>

<template>
  <div class="left-bar">
    <AuroraButton color="primary" :handler="switchOrigin" shadow>
      <i class="ri-box-3-line"></i>&nbsp;
      <span style="margin-left: 2px">Switch Origin</span>
    </AuroraButton>
  </div>
</template>

<style scoped>
.left-bar {
  width: 240px;
  display: flex;
  flex-direction: column;
  padding: 8px 8px;
}
</style>
