<script setup lang="ts">
import OriginSelector from "./components/origin-selector.vue";
</script>

<template>
  <aurora-world force-color-mode="light">
    <OriginSelector />
    <div class="cookbook">
      <left-bar />
      <div class="main-view">
        <api-viewer />
        <api-explorer />
      </div>
    </div>
  </aurora-world>
</template>

<style>
:root,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.cookbook {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: rgba(var(--aurora-bg-color-grey));
}

.main-view {
  flex: 1;
  width: 0;
  height: calc(100% - 8px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 16px rgba(var(--aurora-text-color), 0.02);
  background-color: rgba(var(--aurora-bg-color), 1);
  overflow: hidden;
  border-radius: 16px;
  margin: 4px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 160ms ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.van-divider {
  border-color: rgba(var(--aurora-border-color), 1) !important;
}

.github-markdown-body p {
  line-height: 2.4 !important;
}
</style>
