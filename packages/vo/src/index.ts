import { Builtin, DeepReadonly } from "./ts-essentials/index.js";

export type StringOrSymbol = string | symbol;

export const VALUE_OBJECT_NAME = Symbol();

export const VALUE_OBJECT_TYPE = Symbol();

export class ValidValueObject {
  #validated = undefined;
}

export type ValueObjectRegistry = Set<string>;

export const GLOBAL_VALUE_OBJECT_REGISTRY: ValueObjectRegistry =
  new Set<string>();

export type ValueObjectName<NAME extends StringOrSymbol> = {
  [VALUE_OBJECT_NAME]: NAME;
};

export type ValueObjectType<TYPE> = DeepReadonly<TYPE>;

export type ValueObject<
  NAME extends StringOrSymbol,
  TYPE
> = ValueObjectType<TYPE> & {
  [VALUE_OBJECT_TYPE]: TYPE;
} & ValueObjectName<NAME> &
  ValidValueObject;

// TODO: This needs be reviewed and improved
export type UnvalueObject<T> = T extends ValueObject<any, infer TYPE>
  ? TYPE extends Builtin
    ? TYPE
    : TYPE extends {}
    ? { [K in keyof TYPE]: UnvalueObject<TYPE[K]> }
    : { [P in keyof TYPE]: UnvalueObject<[P]> }
  : T extends {}
  ? { [K in keyof T]: UnvalueObject<T[K]> }
  : { [P in keyof T]: UnvalueObject<[P]> };

export type GetValueObjectName<VALUE_OBJECT extends ValueObject<any, any>> =
  VALUE_OBJECT extends ValueObject<any, infer TYPE>
    ? VALUE_OBJECT[typeof VALUE_OBJECT_NAME]
    : never;

export type GetValueObjectType<VALUE_OBJECT extends ValueObject<any, any>> =
  VALUE_OBJECT extends ValueObject<any, infer TYPE>
    ? VALUE_OBJECT[typeof VALUE_OBJECT_TYPE]
    : never;

export const vo = <NAME extends StringOrSymbol, TYPE>(
  name: NAME,
  value: TYPE
): ValueObject<NAME, TYPE> => {
  return value as ValueObject<NAME, TYPE>;
};

export const createValueObject = vo;
