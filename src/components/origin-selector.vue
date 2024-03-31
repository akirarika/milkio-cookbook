<script setup lang="ts">
import { ref, watch } from "vue";
import { cookbookCore, cookbookStates } from "../core";
import { CookbookOrigin } from "../types";
import { aurora } from "@aurora-design/vue";

const custom = cookbookConfig.custom;

const edit = () => {
  cookbookStates.window.enableOriginEditor = !cookbookStates.window.enableOriginEditor;
};

const origins = ref<Record<string, typeof CookbookOrigin>>(JSON.parse(cookbookStates.connectConfig.value));
watch(
  () => cookbookStates.connectConfig.value,
  (value) => (origins.value = JSON.parse(value))
);

let connecting = ref(false);
const connectOrigin = async (name: string) => {
  connecting.value = true;
  const timer = setTimeout(() => {
    connecting.value = false;
    aurora.toast.show({
      message: "Connection timeout, check the config or network",
      type: "error",
      button: "OK",
    });
  }, 8000);

  const origin = origins.value[name];
  if (!(await cookbookCore.connectOrigin(name, origin))) {
    connecting.value = false;
    aurora.toast.show({
      message: "Connection failed, check the config or network",
      type: "error",
      button: "OK",
    });
    return;
  }

  clearTimeout(timer);
  // The delay added here is for visual effect. Sometimes, it's not good if it's too fast.
  setTimeout(() => {
    cookbookStates.window.enableOriginSelector = false;
    setTimeout(() => (connecting.value = false), 512);
  }, 768);
};
</script>

<template>
  <transition>
    <div class="origin-selector" v-if="cookbookStates.window.enableOriginSelector">
      <div class="origin-selector--container">
        <img class="name" src="../assets/cookbook.svg" :class="{ connecting: connecting }" />
        <van-cell-group
          inset
          class="origin-selector--content"
          :style="{
            opacity: connecting ? `0` : `1`,
            'max-height': connecting ? `0px` : `220px`,
            'pointer-events': connecting ? `none` : `auto`,
          }"
        >
          <template v-for="(origin, k) in origins" :key="k">
            <van-cell :label="origin.cookbook" is-link @click="connectOrigin(k)">
              <template #title> {{ k }} <span class="last">last</span></template>
            </van-cell>
          </template>
        </van-cell-group>
        <transition>
          <AuroraButton
            v-if="custom"
            :handler="edit"
            class="edit-connect-configs"
            color="primary"
            shadow
            :style="{ opacity: connecting ? `0` : `1`, 'pointer-events': connecting ? `none` : `auto` }"
          >
            <i class="ri-edit-line"></i>
            <span style="margin-left: 8px">Edit Connect Config</span>
          </AuroraButton>
        </transition>
      </div>
      <origin-editor v-if="custom && cookbookStates.window.enableOriginEditor"></origin-editor>
    </div>
  </transition>
</template>

<style>
.origin-selector {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--aurora-bg-color), 1);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.origin-selector .name {
  height: 48px;
  opacity: 0.32;
  margin-bottom: 16px;
  pointer-events: none;
}

.origin-selector .name.connecting {
  animation: loading-animation 240ms linear infinite;
}

.origin-selector--container {
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.origin-selector--content {
  width: 320px;
  border: 1px solid rgba(var(--aurora-border-color), 1);
  box-shadow: 0 0 16px rgba(var(--aurora-text-color), 0.04);
  overflow-y: scroll;
  cursor: pointer;
  transition: all 360ms ease;
}

.origin-selector--content::-webkit-scrollbar {
  display: none;
}

.origin-selector--content .last {
  background-color: rgba(var(--aurora-bg-color-grey), 1);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.edit-connect-configs {
  margin-top: 24px;
  width: 320px;
  transition: opacity 240ms ease;
}

@keyframes loading-animation {
  0% {
    opacity: 0.24;
  }

  40% {
    opacity: 0.32;
  }

  60% {
    opacity: 0.32;
  }

  100% {
    opacity: 0.24;
  }
}
</style>
