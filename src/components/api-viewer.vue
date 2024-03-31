<script setup lang="ts">
import { cookbookStates } from "../core";
</script>

<template>
  <div class="api-viewer">
    <template v-if="cookbookStates.window.explorerActiveDocment && cookbookStates.activeOrigin.value">
      <api-viewer-content
        :id="cookbookStates.window.explorerActiveDocment"
        :data="cookbookStates.activeOrigin.value.cookbook.cookbook[cookbookStates.window.explorerActiveDocment]"
        :key="cookbookStates.window.explorerActiveDocment"
        :style="{ minHeight: `calc(100% - ${cookbookStates.window.bottomViewHeight}px)` }"
      />
      <div :style="{ height: `${cookbookStates.window.bottomViewHeight}px` }"></div>
    </template>
    <div v-else class="api-viewer--not-found" :style="{ height: `calc(100% - ${cookbookStates.window.bottomViewHeight}px)` }">
      <v-md-preview :text="cookbookStates.activeOrigin.value?.cookbook.readme ?? ''"></v-md-preview>
    </div>
  </div>
</template>

<style scoped>
.api-viewer {
  height: 0;
  flex: 1;
  overflow-y: scroll;
}

.api-viewer::-webkit-scrollbar {
  display: none;
}

.api-viewer--not-found {
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.api-viewer--not-found > *) {
  width: 100%;
}
</style>
