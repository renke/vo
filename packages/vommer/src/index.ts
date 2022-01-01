import {
  GetValueObjectType,
  UnvalueObject,
  ValueObjectRegistry,
} from "@renke/vo";
import { GetVodTypeValueObject, vod as internalVod, VodType } from "@renke/vod";
import { nothing, produce } from "immer";
import { ZodType, ZodTypeDef } from "zod";
import { DeepWritable } from "./ts-essentials/index.js";

type RecipeReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? typeof nothing : never);

export function vommer<VOD_TYPE extends VodType<any, any>>(
  vodType: VOD_TYPE,
  recipe: (
    baseValue: DeepWritable<UnvalueObject<GetVodTypeValueObject<VOD_TYPE>>>
  ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
): (
  valueObject: GetVodTypeValueObject<VOD_TYPE>
) => GetVodTypeValueObject<VOD_TYPE>;

export function vommer<VOD_TYPE extends VodType<any, any>>(
  vodType: VOD_TYPE,
  valueObject: GetVodTypeValueObject<VOD_TYPE>,
  recipe: (
    baseValue: DeepWritable<UnvalueObject<GetVodTypeValueObject<VOD_TYPE>>>
  ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>
): GetVodTypeValueObject<VOD_TYPE>;

export function vommer<VOD_TYPE extends VodType<any, any>>(
  vodType: VOD_TYPE,
  rawValueObject: any,
  rawRecipe?: any
): (
  valueObject: GetVodTypeValueObject<VOD_TYPE>
) => GetVodTypeValueObject<VOD_TYPE> {
  if (typeof rawValueObject !== "function" && typeof rawRecipe == "function") {
    const valueObject = rawValueObject as GetVodTypeValueObject<VOD_TYPE>;

    const recipe = rawRecipe as (
      baseValue: GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>
    ) => RecipeReturnType<GetValueObjectType<GetVodTypeValueObject<VOD_TYPE>>>;

    const value = valueObject as GetValueObjectType<
      GetVodTypeValueObject<VOD_TYPE>
    >;

    const newValue = produce(value, recipe);

    // TODO: This is hacky but don't really need the recursive unvalue object stuff here
    const newValueObject = (vodType.create as any)(newValue);

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

export interface VommerMethods<VOD_TYPE extends VodType<any, any>> {
  change: VommerChangeMethod<VOD_TYPE>;
}

export interface VommerChangeMethod<VOD_TYPE extends VodType<any, any>> {
  (
    valueObject: GetVodTypeValueObject<VOD_TYPE>,
    recipe: (
      baseValue: DeepWritable<UnvalueObject<GetVodTypeValueObject<VOD_TYPE>>>
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

export type VommerType<NAME extends string, TYPE> = VodType<NAME, TYPE> &
  VommerMethods<VodType<NAME, TYPE>>;

export function vod<
  NAME extends string,
  OUTPUT,
  INPUT,
  ZOD_TYPE_DEF extends ZodTypeDef = ZodTypeDef
>(
  name: NAME,
  type: ZodType<OUTPUT, ZOD_TYPE_DEF, INPUT>,
  valueObjectRegistry: ValueObjectRegistry | undefined = undefined
): VommerType<NAME, OUTPUT> {
  const vodType = internalVod(name, type, valueObjectRegistry);

  const vommerMethods: VommerMethods<typeof vodType> = {
    change: ((valueObject: any, recipe?: any) =>
      vommer(vodType, valueObject, recipe)) as VommerChangeMethod<
      typeof vodType
    >,
  };

  return Object.assign(vodType, vommerMethods);
}
