import { createLoongbaoClient } from "loongbao-client";

export const client = createLoongbaoClient({
  baseUrl: `${import.meta.env.VITE_BASE_API}`,
  async handler(url, body, headers) {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    return await response.text();
  },
});
