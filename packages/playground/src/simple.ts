import { z } from "zod";
import { v } from "@renke/vod";

const PositiveNumber = v("PositiveNumber", z.number().min(1));

type PositiveNumber = z.infer<typeof PositiveNumber>;

// OKAY
const number1: PositiveNumber = PositiveNumber.create(1);

// NOT OKAY - Fails at run time because -1 is not a positive number
const number2: PositiveNumber = PositiveNumber.create(-1);

const number3: PositiveNumber = PositiveNumber.create(1);

// OKAY – PositiveNumber is a number
const number4: number = number3 + 1;

// NOT OKAY – The result might not be a positive number
const number5: PositiveNumber = number3 - 2;

// NOT OKAY - Fails at run time because -1 is not a positive number
const number6: PositiveNumber = PositiveNumber.create(number3 - 2);

// NOT OKAY – number might not be a positive number
const number7: PositiveNumber = -1;

const add = (x: PositiveNumber, y: PositiveNumber): PositiveNumber => {
  return PositiveNumber.create(x + y);
};

// NOT OKAY – number4 might not be a positive number
const number8 = add(number3, number4);

// OKAY
const number9: PositiveNumber = add(number1, number3);

const number10: unknown = 1;

// NOT OKAY – number10 is not a number (or PositiveNumber)
PositiveNumber.create(number10);

// OKAY – parse from zod allows unknown types
PositiveNumber.parse(number10);

const NegativeNumber = v("NegativeNumber", z.number().max(0));

type NegativeNumber = z.infer<typeof NegativeNumber>;

// OKAY
const number11 = NegativeNumber.create(-1);

// NOT OKAY – number11 is not a PositiveNumber
const number12: PositiveNumber = number11;

// NOT OKAY – Fails at runtime because a value object with name PositiveNumber already exists
const NaturalNumber = v("PositiveNumber", z.number().min(0));
