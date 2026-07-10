// src/app/curriculum-data/index.ts
import { grade1 } from "./elementary/grade1";
import { Grade } from "./types";

export const curriculumData: Record<string, Grade> = {
  "grade1": grade1,
};