<script setup lang="ts">
import { AuroraButton } from "@aurora-design/vue";
import { copyText } from "../utils/copy-text";
import CodeEditor from "./code-editor.vue";

const props = defineProps<{
  id: string;
  data: any;
}>();

const descMarkdown = `# ${props.id.split("/").at(-1)}\n\n` + (props.data.desc ?? `${props.id}`);

const copyPath = async () => {
  await copyText(props.id);
};
</script>

<template>
  <div class="api-viewer-content">
    <div class="api-viewer-content--markdownner">
      <div class="title">API Docment</div>
      <v-md-preview :text="descMarkdown"></v-md-preview>
      <template v-if="data.cases && data.cases.length > 0">
        <van-divider />
        <div class="title">API Cases</div>
        <div class="api-viewer-content--markdownner-cases github-markdown-body">
          <template v-for="(test, _i) in data.cases" :key="_i">
            <p>{{ test.name }}</p>
            <CodeEditor :code="test.handler ?? ''" style="margin-bottom: 16px" />
          </template>
        </div>
      </template>
    </div>
    <div class="api-viewer-content--runner">
      <div class="title">API Path</div>
      <div class="item">
        <AuroraInput :value="props.id" style="flex: 1">
          <template #prefix>
            <i class="ri-link"></i>
          </template>
        </AuroraInput>
        <AuroraButton style="margin-left: 8px" color="primary" :handler="copyPath" shadow icon>
          <i class="ri-file-copy-line"></i>
        </AuroraButton>
      </div>
      <van-divider />
      <div class="title">API Params</div>
      <CodeEditor :code="props.data.params ?? ''" />
      <van-divider />
      <div class="title">API Execute</div>
      <div
        style="
          color: rgba(var(--aurora-text-color-grey), 1);
          background-color: #f0f2f4;
          border-radius: 12px;
          padding: 16px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        to be continued
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.github-markdown-body) {
  padding: 0 0 !important;
}

:deep(.github-markdown-body h1, .github-markdown-body h2) {
  border-bottom: 1px solid rgba(var(--aurora-border-color), 1) !important;
}

.api-viewer-content {
  display: flex;
  flex-direction: row;
}

.api-viewer-content--markdownner {
  flex: 1;
  padding: 8px 20px 32px 20px;
}

.api-viewer-content--markdownner-cases {
  padding-top: 0 !important;
}

.api-viewer-content--markdownner .title {
  padding: 12px 2px 12px 2px;
  font-size: 14px;
  color: rgba(var(--aurora-text-color-grey), 1);
}

.api-viewer-content--runner {
  width: 480px;
  min-width: 480px;
  border-left: 1px solid rgba(var(--aurora-border-color), 1);
  padding: 8px 16px 32px 16px;
}

.api-viewer-content--runner .title {
  padding: 0px 2px 12px 2px;
  font-size: 14px;
  color: rgba(var(--aurora-text-color-grey), 1);
}
.api-viewer-content--runner .title:first-child {
  padding-top: 12px;
}

.api-viewer-content--runner .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
