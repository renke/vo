import { vod, vommer } from "@renke/vommer";
import { z } from "zod";

const Age = vod("Age", z.number().min(0));

type Age = z.infer<typeof Age>;

const Profile = vod("Profile", z.object({ age: Age, nick: z.string().min(1) }));

type Profile = z.infer<typeof Profile>;

const UserWithProfile = vod(
  "UserProfile",
  z.object({
    first: z.string().min(1),
    last: z.string().min(1),
    profile: Profile,
  })
);

type UserWithProfile = z.infer<typeof UserWithProfile>;

// OKAY
const joe = UserWithProfile.create({
  first: "John",
  last: "Doe",
  profile: {
    age: 18,
    nick: "j18",
  },
});

const jane1 = vommer(UserWithProfile, joe, (old) => {
  old.first = "Jane";
  old.profile.age = 2;
});

const jane2 = UserWithProfile.change(joe, (old) => {
  old.first = "Jane";
  old.profile.age = 2;
});

const janer = vommer(UserWithProfile, (joe) => {
  joe.first = "Jane";
  joe.profile.age = 2;
  joe.profile.nick = "ja18";
});

const jane3 = janer(joe);

console.log("JANE1", jane1);
console.log("JANE2", jane1);
console.log("JANE3", jane2);

// type SetStateAction<S> = S | ((prevState: S) => S);
//     // this technically does accept a second argument, but it's already under a deprecation warning
//     // and it's not even released so probably better to not define it.
//     type Dispatch<A> = (value: A) => void;

// const useVommerState = <VOD_EFFECTS extends VodType<any, any, any>>(
//   vodEffects: VOD_EFFECTS
// ) => {
//   const [valueObject, reactSetValueObject] = useState<
//     GetVodTypeValueObject<VOD_EFFECTS>
//   >({} as GetVodTypeValueObject<VOD_EFFECTS>);

//   const setValueObject = useCallback(
//     (
//       foo:
//         | GetVodTypeValueObject<VOD_EFFECTS>
//         | ((
//             prev: GetVodTypeValueObject<VOD_EFFECTS>
//           ) => GetVodTypeValueObject<VOD_EFFECTS>)
//     ) => {
//       if (typeof foo === "function") {
//       } else {
//         return vodEffects.create(foo);
//       }
//     },
//     []
//   );
// };

// const Vommer = () => {
//   const [user, setUser] = useVommerState<UserWithProfile>(() => joe);

//   setUser();
// };
