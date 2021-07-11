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
