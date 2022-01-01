import {
  createValueObject,
  registerValueObject,
  UnvalueObject,
  ValueObject,
  ValueObjectRegistry,
} from "@renke/vo";
import { z, ZodEffects, ZodType, ZodTypeDef } from "zod";

const VOD_VALUE_OBJECT = Symbol();

export interface VodMethods<NAME extends string, TYPE> {
  create: (value: UnvalueObject<TYPE>) => ValueObject<NAME, TYPE>;
}

export type VodType<NAME extends string, TYPE> = ZodEffects<
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

export function vod<NAME extends string, OUTPUT, INPUT>(
  name: NAME,
  type: ZodType<OUTPUT, ZodTypeDef, INPUT>,
  valueObjectRegistry: ValueObjectRegistry | undefined = undefined
): VodType<NAME, OUTPUT> {
  if (valueObjectRegistry !== undefined) {
    registerValueObject(name, valueObjectRegistry);
  }

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
