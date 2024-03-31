import { Type, type Static, Record } from "@sinclair/typebox";

declare global {
  var cookbookConfig: {
    custom: boolean;
  };
}

export const CookbookOriginList = Type.Record(
  Type.String(),
  Type.Object({
    url: Type.String(),
    method: Type.Optional(Type.String()),
    params: Type.Optional(Type.Any()),
    headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  })
);

export const CookbookOrigin = Type.Object({
  base: Type.String(),
  cookbook: Type.String(),
  method: Type.Optional(Type.String()),
  params: Type.Optional(Type.Any()),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
});

export type CookbookItem = {
  title?: string;
  desc?: string;
  params: string;
  paramsSchema?: any;
  cases: Array<{
    name: string;
    handler: string;
  }>;
};
