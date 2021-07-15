import {
  GetValueObjectType,
  ValueObject,
  ValueObjectRegistry,
} from "@renke/vo";
import {
  vod as internalVod,
  GetVodTypeValueObject,
  VodMethods,
  VodType,
} from "@renke/vod";
import { nothing, produce } from "immer";
import { ZodTypeDef, ZodEffects, ZodType } from "zod";
import { DeepWritable } from "./ts-essentials/index.js";

type RecipeReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? typeof nothing : never);

export function vommer<VOD_TYPE extends VodType<any, any, any>>(
  vodType: VOD_TYPE,
  recipe: (
    baseValue: DeepWritable<GetVodTypeValueObject<VOD_TYPE>>
  ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
): (
  valueObject: GetVodTypeValueObject<VOD_TYPE>
) => GetVodTypeValueObject<VOD_TYPE>;

export function vommer<VOD_TYPE extends VodType<any, any, any>>(
  vodType: VOD_TYPE,
  valueObject: GetVodTypeValueObject<VOD_TYPE>,
  recipe: (
    baseValue: DeepWritable<GetVodTypeValueObject<VOD_TYPE>>
  ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
): GetVodTypeValueObject<VOD_TYPE>;

export function vommer<VOD_TYPE extends VodType<any, any, any>>(
  vodType: VOD_TYPE,
  rawValueObject: any,
  rawRecipe?: any
) {
  if (typeof rawValueObject !== "function" && typeof rawRecipe == "function") {
    const valueObject = rawValueObject as GetVodTypeValueObject<VOD_TYPE>;

    const recipe = rawRecipe as (
      baseValue: GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>
    ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>;

    const value = valueObject as GetValueObjectType<
      GetVodTypeValueObject<VOD_TYPE>
    >;

    const newValue = produce(value, recipe);

    const newValueObject = vodType.create(newValue);

    return newValueObject;
  }

  if (typeof rawValueObject === "function" && typeof rawRecipe !== "function") {
    const recipe = rawValueObject as (
      baseValue: GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>
    ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>;

    const producer = (valueObject: GetVodTypeValueObject<VOD_TYPE>) => {
      const value = valueObject as GetValueObjectType<
        GetVodTypeValueObject<VOD_TYPE>
      >;

      const newValue = produce(value, recipe);

      const newValueObject = vodType.create(newValue);

      return newValueObject;
    };

    return producer;
  }

  throw new Error("Vommer failed. Wrong runtime types?");
}

export interface VommerMethods<VOD_TYPE extends VodType<any, any, any>> {
  change: VommerChangeMethod<VOD_TYPE>;
}

export interface VommerChangeMethod<VOD_TYPE extends VodType<any, any, any>> {
  (
    valueObject: GetVodTypeValueObject<VOD_TYPE>,
    recipe: (
      baseValue: DeepWritable<
        GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>
      >
    ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
  ): GetVodTypeValueObject<VOD_TYPE>;

  (
    recipe: (
      baseValue: DeepWritable<
        GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>
      >
    ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
  ): (
    valueObject: GetVodTypeValueObject<VOD_TYPE>
  ) => GetVodTypeValueObject<VOD_TYPE>;
}

export type VommerType<
  NAME extends string,
  TYPE,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef
> = VodType<NAME, TYPE, ZOD_TYPE_DEF> &
  VommerMethods<VodType<NAME, TYPE, ZOD_TYPE_DEF>>;

export function vod<
  NAME extends string,
  TYPE,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef
>(
  name: NAME,
  type: ZodType<TYPE, ZOD_TYPE_DEF, TYPE>,
  valueObjectRegistry: ValueObjectRegistry | undefined = undefined
): VommerType<NAME, TYPE, ZOD_TYPE_DEF> {
  const vodType = internalVod(name, type, valueObjectRegistry);

  const vommerMethods: VommerMethods<typeof vodType> = {
    change: ((valueObject: any, recipe?: any) =>
      vommer(vodType, valueObject, recipe)) as VommerChangeMethod<
      typeof vodType
    >,
  };

  return Object.assign(vodType, vommerMethods);
}
