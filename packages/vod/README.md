# vod

Immutable, type-safe, validated, nominal value objects in TypeScript based on [@renke/vo](../../packages/vo) and [zod](https://github.com/colinhacks/zod).

# Installation

```
npm install @renke/vod
```

If you don't have zod installed already:

```
npm install @renke/vod zod
```

# Usage

## Simple Value Objects (for primitive types)

```ts
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
```

## Complex Value Objects

```ts
import { z } from "zod";
import { v } from "@renke/vod";

const User = v(
  "User",
  z.object({ first: z.string().min(1), last: z.string().min(1) })
);

type User = z.infer<typeof User>;

// NOT OKAY – Object might not be a valid User
const user1: User = { first: "John", last: "Doe" };

// OKAY
const user2: User = User.create({ first: "John", last: "Doe" });

// NOT OKAY – User objects are not mutable
user2.first = "Jane";

// OKAY
const user3: User = User.create({ ...user2, first: "Jane" });

const Age = v("Age", z.number().min(0));

type Age = z.infer<typeof Age>;

const Profile = v("Profile", z.object({ age: Age, nick: z.string().min(1) }));

type Profile = z.infer<typeof Profile>;

const UserWithProfile = v(
  "UserProfile",
  z.object({
    first: z.string().min(1),
    last: z.string().min(1),
    profile: Profile,
  })
);

type UserWithProfile = z.infer<typeof UserWithProfile>;

// OKAY
const userWithProfile1 = UserWithProfile.create({
  first: "John",
  last: "Doe",
  profile: {
    age: 18,
    nick: "j18",
  },
});

// OKAY
const profile1 = Profile.create({ age: 18, nick: "j18" });

// OKAY
const userWithProfile2 = UserWithProfile.create({
  first: "John",
  last: "Doe",
  profile: profile1,
});

const replaceProfile = (
  user: UserWithProfile,
  profile: Profile
): UserWithProfile => {
  return UserWithProfile.create({ ...user, profile });
};

// OKAY
const profile2 = Profile.create({ age: 19, nick: "j19" });

// OKAY
const userWithProfile3 = replaceProfile(userWithProfile2, profile1);

// NOT OKAY – Object might not be a valid UserWithProfile
const userWithProfile4: UserWithProfile = { ...userWithProfile3, last: "Jane" };
```
