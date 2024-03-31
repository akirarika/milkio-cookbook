import { reactive, ref } from "vue";
import { CookbookOrigin, CookbookOriginList } from "../types";
import { aurora } from "@aurora-design/vue";
import { Value } from "@sinclair/typebox/value";
import { TSON } from "@southern-aurora/tson";

const connectConfigRaw = await (async () => {
  const response = await fetch("./connect-config.json");
  return response.text();
})();

export const cookbookStates = {
  window: reactive({
    enableOriginSelector: true,
    enableOriginEditor: false,
    bottomViewHeight: ref(Math.round(0.4 * window.innerHeight)),
    explorerActivePaths: [] as Array<string>,
    explorerActiveDocment: undefined as undefined | string,
  }),
  openAPI: undefined as string | undefined,
  connectConfig: ref<string>(
    (() => {
      try {
        let json = localStorage.getItem("connectConfig");
        if (!json) json = connectConfigRaw;
        return JSON.stringify(JSON.parse(json), null, 2);
      } catch (error) {
        alert(`Your "connectConfig" is not in the correct JSON format`);
      }
    })()!
  ),
  activeOrigin: ref<
    | undefined
    | {
        name: string;
        origin: typeof CookbookOrigin;
        cookbook: any;
      }
  >(undefined),
};

const _core = () => {
  // const localOrigins = localStorage.getItem("cookbookOrigins");
  // if (localOrigins) cookbookStates.origins.value = TSON.parse(localOrigins);
  // else cookbookStates.origins.value.push(...JSON.parse(cookbookConfig.connectConfig));

  const core = {
    saveConnectConfig(json: string) {
      try {
        let paused = JSON.parse(json);
        paused = Value.Clean(CookbookOriginList, paused);
        if (!Value.Check(CookbookOriginList, paused)) throw new Error("Connect Config is Incorrect");
        const stringified = JSON.stringify(paused, null, 2);
        localStorage.setItem("connectConfig", stringified);
        cookbookStates.connectConfig.value = stringified;
      } catch (error) {
        console.error(error);
        aurora.toast.removeAll();
        aurora.toast.show({
          message: "Connect Config is Incorrect",
          type: "error",
          button: "OK",
        });
        return;
      }
      aurora.toast.removeAll();
      aurora.toast.show({
        message: "Connect Config Saved",
        type: "success",
        button: "OK",
      });
    },
    async connectOrigin(name: string, origin: typeof CookbookOrigin) {
      console.log("connecting", name, origin);
      const response = await fetch(origin.cookbook, {
        method: origin.method ?? "POST",
        headers: new Headers(origin.headers),
        body: TSON.stringify(origin.params),
      });

      if (!response.ok) return false;
      const result = TSON.parse(await response.text());
      console.log("result", result);
      if (!result.success) return false;

      const cookbook = {
        name,
        origin,
        cookbook: result.data,
      };
      cookbookStates.activeOrigin.value = cookbook;
      console.log("connected", cookbook);

      return true;
    },
    async activePathBackTo(index: number) {
      cookbookStates.window.explorerActivePaths = cookbookStates.window.explorerActivePaths.slice(0, index);
    },
    async activePathNavigateTo(path: string) {
      cookbookStates.window.explorerActivePaths = path.split("/");
    },
    async activeDocmentNavigateTo(path?: string) {
      cookbookStates.window.explorerActiveDocment = path;
    },
  };

  return core;
};

export const cookbookCore = _core();
