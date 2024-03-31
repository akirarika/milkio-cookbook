<script setup lang="ts">
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { getEditorTheme } from "../utils/editor-theme";
import { javascript } from "@codemirror/lang-javascript";

const props = defineProps<{
  code: string;
}>();

const editorTheme = getEditorTheme();

/**
 * -- Params Editor
 */

const editorElement = ref<HTMLDivElement | undefined>(undefined);
let paramsEditor = undefined as EditorView | undefined;
onMounted(() => {
  let editorState = EditorState.create({
    doc: props.code,
    extensions: [
      //
      editorTheme,
      javascript({ jsx: true, typescript: true }),
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
    ],
  });

  paramsEditor = new EditorView({
    state: editorState,
    parent: editorElement.value,
  });
});

onBeforeUnmount(() => {
  paramsEditor!.destroy();
});
</script>

<template>
  <div class="code-editor">
    <div ref="editorElement"></div>
  </div>
</template>

<style>
.code-editor {
  background-color: #f0f2f4;
  padding: 12px 8px;
  border-radius: 12px;
  font-size: 14px !important;
}

.code-editor > * {
  border: none !important;
}

.code-editor-copy,
.code-editor-copy * {
  font-style: normal !important;
}
</style>
