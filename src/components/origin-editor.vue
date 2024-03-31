<script setup lang="ts">
import { JSONEditor } from "vanilla-jsoneditor";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cookbookCore, cookbookStates } from "../core";
import { AuroraButton } from "@aurora-design/vue";

let editor: JSONEditor | undefined;
let editorElement = ref<HTMLDivElement | undefined>(undefined);

onMounted(() => {
  editor = new JSONEditor({
    target: editorElement.value!,
    props: {
      mode: "text" as any,
      mainMenuBar: false,
      content: {
        text: cookbookStates.connectConfig.value,
      },
    },
  });
  watch(
    () => cookbookStates.connectConfig.value,
    (value) => editor!.set({ text: JSON.parse(value) })
  );
});

onBeforeUnmount(() => {
  editor!.destroy();
  editor = undefined;
});

const save = () => {
  const content: any = editor!.get();
  cookbookCore.saveConnectConfig(content.text);
};

const onSaveForKeyboard = (e: KeyboardEvent) => {
  // @ts-ignore: userAgentData exists in chrome 90+
  if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    save();
  }
  return false;
};
onMounted(() => editorElement.value!.addEventListener("keydown", onSaveForKeyboard));
onBeforeUnmount(() => editorElement.value!.removeEventListener("keydown", onSaveForKeyboard));
</script>

<template>
  <div class="origin-editor">
    <div class="origin-editor--menubar">
      <AuroraButton color="primary" shadow :handler="save">
        <i class="ri-check-double-line"></i>
        <span style="margin-left: 8px">Verify & Save Connect Config</span>
      </AuroraButton>
    </div>
    <div class="origin-editor--raw" ref="editorElement"></div>
    <div class="origin-editor--bottombar">
      <div style="margin-left: 12px; color: rgb(var(--aurora-text-color-grey)); line-height: 1.2">
        <div>Others cannot see your configuration, these configurations are stored in your browser.</div>
        <div>
          When the editor is saved, it will help you remove redundant values. If you find that some values have not taken effect and they
          disappear from the editor after refreshing the page, it means that these values have spelling errors.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.origin-editor {
  width: 0;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.origin-editor--menubar {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-left: 1px solid rgba(var(--aurora-border-color), 1);
  padding: 8px;
}

.origin-editor--bottombar {
  border-left: 1px solid rgba(var(--aurora-border-color), 1);
  line-height: 1.2;
  padding: 8px;
}

.origin-editor--raw {
  height: 0;
  flex: 1;
}
</style>
