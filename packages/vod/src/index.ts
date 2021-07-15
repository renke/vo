import {
  createValueObject,
  registerValueObject,
  ValueObject,
  ValueObjectRegistry,
} from "@renke/vo";
import { z, ZodEffects, ZodType, ZodTypeDef } from "zod";

const VOD_VALUE_OBJECT = Symbol();

export interface VodMethods<NAME extends string, TYPE> {
  create: (value: TYPE) => ValueObject<NAME, TYPE>;
}

export type VodType<
  NAME extends string,
  TYPE,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef
> = ZodEffects<ZodType<TYPE, ZOD_TYPE_DEF, TYPE>, ValueObject<NAME, TYPE>> & {
  [VOD_VALUE_OBJECT]: ValueObject<NAME, TYPE>;
} & VodMethods<NAME, TYPE>;

export type GetVodTypeValueObject<VOD_EFFECTS extends VodType<any, any, any>> =
  VOD_EFFECTS extends VodType<infer NAME, infer TYPE, infer ZOD_TYPE_DEF>
    ? VOD_EFFECTS[typeof VOD_VALUE_OBJECT]
    : never;

export function vod<
  NAME extends string,
  TYPE,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef
>(
  name: NAME,
  type: ZodType<TYPE, ZOD_TYPE_DEF, TYPE>,
  valueObjectRegistry: ValueObjectRegistry | undefined = undefined
): VodType<NAME, TYPE, ZOD_TYPE_DEF> {
  if (valueObjectRegistry !== undefined) {
    registerValueObject(name, valueObjectRegistry);
  }

  const zodEffect = type.transform((value) => {
    return createValueObject(name, value);
  });

  const vodMethods: VodMethods<NAME, TYPE> = {
    create: (value) => {
      return zodEffect.parse(value);
    },
  };

  return Object.assign(zodEffect, vodMethods) as VodType<
    NAME,
    TYPE,
    ZOD_TYPE_DEF
  >;
}

export const v = vod;

export default vod;
