import { v } from "@renke/vod";
import { createValueObject, UnvalueObject, ValueObject } from "@renke/vo";
import { z } from "zod";

const NaturalNumber = v("NaturalNumber", z.number().min(1));

type NaturalNumber = z.infer<typeof NaturalNumber>;

const natVo1 = NaturalNumber.parse(1);

type PosNumber = ValueObject<"PosNumber", number>;

const posNum: PosNumber = {} as any;

type OnlyNumber = UnvalueObject<PosNumber>;

const a: OnlyNumber = 1;

const b: number = a;

// fails because not validated
const nat1: NaturalNumber = 1;

const nat2: number = natVo1 + 1;

const add = (
  natFirst: NaturalNumber,
  natSecond: NaturalNumber
): NaturalNumber => {
  return NaturalNumber.parse(natFirst + natSecond);
};

const nat3 = 1;

// fails because nat3 is not validated
add(natVo1, nat3);

const natVo2 = add(natVo1, natVo1);

const User = v(
  "User",
  z.object({ firstName: z.string().min(1), lastName: z.string().min(1) })
);

type User = z.infer<typeof User>;

const userVo1 = User.parse({ firstName: "John", lastName: "Doe" });

// fails because changed user is not validated
const userVo2: User = { ...userVo1, firstName: "Jane" };

const userVo3: User = User.parse({ ...userVo1, firstName: "Jane" });

// fails because user is read-only
userVo3.firstName = "Jane";

const FirstName = v("FirstName", z.string().min(1));

type FirstName = z.infer<typeof FirstName>;

const LastName = v("LastName", z.string().min(1));

type LastName = z.infer<typeof LastName>;

const Person = v(
  "Person",
  z.object({ firstName: FirstName, lastName: LastName })
);

type Person = z.infer<typeof Person>;

// fails because person and user are differnt value objects
const userVo4: User = Person.parse({ firstName: "John", lastName: "Doe" });

// does not fail, but it probably can't be helped
const userVo5: User = Object.assign(userVo1, { firstName: "Jane" });

const personVo1: Person = Person.parse({ firstName: "John", lastName: "Doe" });

console.log(personVo1.firstName.toUpperCase());

const firstNameVo1 = FirstName.parse("John");

const lastNameVo1 = FirstName.parse("Jane");

const personVo2: Person = Person.parse({
  firstName: firstNameVo1,
  lastName: lastNameVo1,
});

const person: Person = Person.create({
  firstName: "23kj",
  lastName: "skdjf",
});

const Settings = v(
  "Settings",
  z.object({
    nested: z.object({
      nested: z.object({
        nested: z.string(),
      }),
    }),
  })
);

type Settings = z.infer<typeof Settings>;

const settings = Settings.parse({ nested: { nested: { nested: "a" } } });

// fails because settings is immutable
settings.nested.nested.nested = "b";

createValueObject("X", 1);
createValueObject("X", 1);
