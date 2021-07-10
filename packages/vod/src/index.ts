import {
  createValueObject,
  GLOBAL_VALUE_OBJECT_REGISTRY,
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
  valueObjectRegistry: ValueObjectRegistry = GLOBAL_VALUE_OBJECT_REGISTRY
) {
  const ret = type.transform((value) => {
    return createValueObject(name, value, valueObjectRegistry);
  });

  const extras: Extras<NAME, INPUT, OUTPUT> = {
    create: (value) => {
      return ret.parse(value);
    },
  };

  return {
    ...ret,
    ...extras,
  } as typeof ret & typeof extras;
}

export const vod = v;

export default v;
