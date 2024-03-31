import { aurora } from "@aurora-design/vue";

export const copyText = async (text: string) => {
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(text);
  }

  try {
    const element = document.querySelector(".my-id-copy-input input") as HTMLInputElement;
    element.select();
    document.execCommand("copy", true);
  } catch (error) {
    console.warn(error);
  }

  await new Promise((resolve) =>
    setTimeout(async () => {
      await aurora.toast.removeAll();
      void aurora.toast.show({
        message: "已经复制到剪切板啦",
        button: "好的",
      });
      resolve(undefined);
    }, 0)
  );
};
