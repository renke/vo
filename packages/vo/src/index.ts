import { DeepReadonly } from "./ts-essentials/index.js";

const VALUE_OBJECT_NAME = Symbol();

const VALUE_OBJECT_TYPE = Symbol();

class ValidValueObject {
  #validated = undefined;
}

export type ValueObjectRegistry = Set<string>;

export const GLOBAL_VALUE_OBJECT_REGISTRY: ValueObjectRegistry =
  new Set<string>();

type ValueObjectName<NAME extends string> = { [VALUE_OBJECT_NAME]: NAME };

type ValueObjectType<TYPE> = DeepReadonly<TYPE>;

export type ValueObject<NAME extends string, TYPE> = ValueObjectType<TYPE> & {
  [VALUE_OBJECT_TYPE]: TYPE;
} & ValueObjectName<NAME> &
  ValidValueObject;

export type UnvalueObject<VALUE_OBJECT extends ValueObject<any, any>> =
  VALUE_OBJECT extends ValueObject<any, infer TYPE>
    ? VALUE_OBJECT[typeof VALUE_OBJECT_TYPE]
    : never;

export const vo = <NAME extends string, TYPE>(
  name: NAME,
  value: TYPE,
  valueObjectRegistry:
    | ValueObjectRegistry
    | undefined = GLOBAL_VALUE_OBJECT_REGISTRY
): ValueObject<NAME, TYPE> => {
  if (valueObjectRegistry !== undefined) {
    if (valueObjectRegistry.has(name)) {
      throw new Error(
        `Value object type with name '${name}' has already been registered. Each value object type must have a unique name.`
      );
    }

    valueObjectRegistry.add(name);
  }

  return value as ValueObject<NAME, TYPE>;
};

export const createValueObject = vo;
