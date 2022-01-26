import { createValueObject, UnvalueObject, ValueObject } from "@renke/vo";
import { ZodEffects, ZodType, ZodTypeDef } from "zod";

type StringOrSymbol = string | symbol;

const VOD_VALUE_OBJECT = Symbol();

export interface VodMethods<NAME extends StringOrSymbol, TYPE> {
  create: (value: UnvalueObject<TYPE>) => ValueObject<NAME, TYPE>;
}

export type VodType<NAME extends StringOrSymbol, TYPE> = ZodEffects<
  ZodType<ValueObject<NAME, TYPE>, ZodTypeDef, TYPE>,
  ValueObject<NAME, TYPE>
> & {
  [VOD_VALUE_OBJECT]: ValueObject<NAME, TYPE>;
} & VodMethods<NAME, TYPE>;

export type GetVodTypeValueObject<VOD_EFFECTS> = VOD_EFFECTS extends VodType<
  any,
  any
>
  ? VOD_EFFECTS[typeof VOD_VALUE_OBJECT]
  : never;

export function vod<NAME extends StringOrSymbol, OUTPUT, INPUT>(
  name: NAME,
  type: ZodType<OUTPUT, ZodTypeDef, INPUT>
): VodType<NAME, OUTPUT> {
  const zodEffect = type.transform((value) => {
    return createValueObject(name, value);
  });

  const vodMethods: VodMethods<NAME, OUTPUT> = {
    create: (value) => {
      return zodEffect.parse(value);
    },
  };

  return Object.assign(zodEffect, vodMethods) as unknown as VodType<
    NAME,
    OUTPUT
  >;
}

export const v = vod;

export default vod;
