import { atom } from "recoil";
import { v4 as uuidv4 } from "uuid";

export const noteState = atom({
  key: "noteState",
  default: [
    {
      id: uuidv4(),
      tabName: "Empty Tab",
      content: "santhosh",
    },
    {
      id: uuidv4(),
      tabName: "Second Tab",
      content: "Second tab Content",
    },
  ],
});
