<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watchEffect } from "vue";
import { AuroraButton } from "@aurora-design/vue";
import { cookbookStates, cookbookCore } from "../core";

const floatingPanelAnchors = ref<Array<number>>([]);
floatingPanelAnchors.value.push(30);
for (let index = 0.1; index < 0.95; index = index + 0.0125) floatingPanelAnchors.value.push(Math.round(window.innerHeight * index));
floatingPanelAnchors.value.push(window.innerHeight - 4);

const explorerColumns = ref(["(root)"]);
watchEffect(() => {
  if (cookbookStates.window.explorerActivePaths.length === 0) explorerColumns.value = ["(root)"];
  else if (cookbookStates.window.explorerActivePaths.length === 1)
    explorerColumns.value = ["(root)", cookbookStates.window.explorerActivePaths[0]];
  else if (cookbookStates.window.explorerActivePaths.length === 2)
    explorerColumns.value = [
      "(root)",
      cookbookStates.window.explorerActivePaths[0],
      [cookbookStates.window.explorerActivePaths[0], cookbookStates.window.explorerActivePaths[1]].join("/"),
    ];
  else {
    explorerColumns.value = [
      cookbookStates.window.explorerActivePaths.slice(0, -2).join("/"),
      cookbookStates.window.explorerActivePaths.slice(0, -1).join("/"),
      cookbookStates.window.explorerActivePaths.join("/"),
    ];
  }
});

const explorerMenubarWheel = ref<HTMLDivElement | undefined>(undefined);
const onExplorerMenubarWheel = (event: WheelEvent) => {
  event.preventDefault();
  explorerMenubarWheel.value!.scrollLeft += event.deltaY;
};

watchEffect(() => {
  if (!explorerMenubarWheel.value) return;
  explorerMenubarWheel.value!.removeEventListener("wheel", onExplorerMenubarWheel);
  nextTick(() => explorerMenubarWheel.value!.addEventListener("wheel", onExplorerMenubarWheel));
});

onBeforeUnmount(() => explorerMenubarWheel.value!.removeEventListener("wheel", onExplorerMenubarWheel));
</script>

<template>
  <van-floating-panel
    v-if="cookbookStates.activeOrigin.value"
    v-model:height="cookbookStates.window.bottomViewHeight"
    class="api-explorer"
    :content-draggable="false"
    :anchors="floatingPanelAnchors"
  >
    <div class="api-explorer--container">
      <div class="api-explorer--menubar" ref="explorerMenubarWheel">
        <AuroraButton class="readme" shadow :handler="() => cookbookCore.activeDocmentNavigateTo(undefined)">
          <i class="ri-file-3-line"></i>
          <span>README.md</span>
        </AuroraButton>
        <span class="divider"></span>
        <AuroraButton color="primary" second icon shadow :handler="() => cookbookCore.activePathBackTo(0)">
          <i class="ri-home-4-line"></i>
        </AuroraButton>
        <template v-for="(path, i) in cookbookStates.window.explorerActivePaths" :key="`${path}-${i}`">
          <i class="api-explorer--menubar-arrow ri-arrow-right-s-line"></i>
          <AuroraButton color="primary" second shadow @click="cookbookCore.activePathBackTo(i + 1)">
            {{ path }}
          </AuroraButton>
        </template>
      </div>
      <div
        class="api-explorer--content"
        :style="{
          minHeight: `60px`,
          height: `${cookbookStates.window.bottomViewHeight - (30 + 36 + 6 + 24)}px`,
        }"
      >
        <div class="api-explorer--column" v-for="i in 3" :key="i">
          <AuroraMenu>
            <template
              v-if="cookbookStates.activeOrigin.value.cookbook.folderIndexes[explorerColumns[i - 1]]"
              v-for="path in cookbookStates.activeOrigin.value.cookbook.folderIndexes[explorerColumns[i - 1]]"
              :key="path"
            >
              <AuroraMenuItem @click="cookbookCore.activePathNavigateTo(path)">
                {{ path.split("/").at(-1) }}
                <template #before>
                  <i class="ri-folder-line"></i>
                </template>
                <template #after>
                  <i class="ri-arrow-right-s-line"></i>
                </template>
              </AuroraMenuItem>
            </template>
            <template
              v-if="cookbookStates.activeOrigin.value.cookbook.indexes[explorerColumns[i - 1]]"
              v-for="path in cookbookStates.activeOrigin.value.cookbook.indexes[explorerColumns[i - 1]]"
              :key="path"
            >
              <AuroraMenuItem @click="cookbookCore.activeDocmentNavigateTo(path)">
                <span>{{ path.split("/").at(-1) }}</span>
                <template v-if="cookbookStates.activeOrigin.value.cookbook.cookbook[path]?.title">
                  <span class="api-explorer--column-divider">|</span>
                  <span class="api-explorer--column-title">{{ cookbookStates.activeOrigin.value.cookbook.cookbook[path]?.title }}</span>
                </template>
                <template #before>
                  <i class="ri-box-1-line"></i>
                </template>
              </AuroraMenuItem>
            </template>
          </AuroraMenu>
        </div>
      </div>
      <div v-if="cookbookStates.activeOrigin.value" class="api-explorer--statusbar">
        <span>Cookbook Generated in {{ cookbookStates.activeOrigin.value.cookbook.generatedAt }}</span>
        <span style="flex: 1"></span>
        <span style="margin-right: 8px">{{ cookbookStates.activeOrigin.value.origin.base }}</span>
        <span>-</span>
        <span style="margin-left: 8px">{{ cookbookStates.activeOrigin.value.name }}</span>
        <span class="decorative-point"></span>
      </div>
    </div>
  </van-floating-panel>
</template>

<style>
.api-explorer.van-floating-panel {
  position: absolute !important;
  width: 100% !important;
  box-shadow: 0 0 16px rgba(var(--aurora-text-color), 0.04);
  border: 1px solid rgba(var(--aurora-border-color), 1);
}

.api-explorer--container {
  display: flex;
  flex-direction: column;
}

.api-explorer--menubar {
  height: 36px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
  padding: 0 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-y: scroll;
}

.api-explorer--menubar::-webkit-scrollbar {
  display: none;
}

.api-explorer--menubar-arrow {
  color: rgba(var(--aurora-text-color-grey), 1);
  margin: 0 6px;
}

.api-explorer--content {
  display: flex;
  flex-direction: row;
}

.api-explorer--column {
  height: calc(100% - 8px);
  background: rgba(var(--aurora-grey), 1);
  flex: 1;
  width: 0;
  overflow-y: scroll;
  margin: 0 8px 8px 8px;
  border-radius: 10px;
  border: 1px solid rgba(var(--aurora-border-color), 1);
  box-shadow: 0 inset 0 16px rgba(var(--aurora-text-color), 0.12);
}

.api-explorer--column-divider {
  color: rgba(var(--aurora-text-color-grey), 1);
  padding: 0 4px;
}

.api-explorer--column-title {
  color: rgba(var(--aurora-text-color-grey), 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.api-explorer--statusbar {
  height: 16px;
  margin-bottom: 8px;
  padding: 0 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgba(var(--aurora-text-color-grey), 1);
  font-size: 12px;
}

.decorative-point {
  margin-left: 8px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background-color: rgba(var(--aurora-success), 1);
}

.api-explorer--menubar .readme {
}

.api-explorer--menubar .readme i {
  margin-right: 6px;
}

.api-explorer--menubar .divider {
  margin: 0 12px;
  background-color: rgba(var(--aurora-border-color), 1);
  width: 1px;
  height: 48%;
}
</style>
