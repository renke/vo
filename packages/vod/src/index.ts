import {
  createValueObject,
  GLOBAL_VALUE_OBJECT_REGISTRY,
  registerValueObject,
  ValueObject,
  ValueObjectRegistry,
} from "@renke/vo";
import { ZodType, ZodTypeDef } from "zod";

export interface Extras<NAME extends string, INPUT, OUTPUT> {
  create: (value: INPUT) => ValueObject<NAME, OUTPUT>;
}

export function v<
  NAME extends string,
  OUTPUT,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef,
  INPUT = OUTPUT
>(
  name: NAME,
  type: ZodType<OUTPUT, ZOD_TYPE_DEF, INPUT>,
  valueObjectRegistry:
    | ValueObjectRegistry
    | undefined = GLOBAL_VALUE_OBJECT_REGISTRY
) {
  if (valueObjectRegistry !== undefined) {
    registerValueObject(name, valueObjectRegistry);
  }

  const zodEffect = type.transform((value) => {
    return createValueObject(name, value);
  });

  const extras: Extras<NAME, INPUT, OUTPUT> = {
    create: (value) => {
      return zodEffect.parse(value);
    },
  };

  return {
    ...zodEffect,
    ...extras,
  } as typeof zodEffect & typeof extras;
}

export const vod = v;

export default v;
