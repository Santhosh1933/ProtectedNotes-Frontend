import { atom } from "recoil";

export const authHook = atom({
  key: "authHook",
  default: { isValid: false, password: null },
});
