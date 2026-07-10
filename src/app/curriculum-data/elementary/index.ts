import { grade1 } from "./grade1";
import { Grade } from "../../types"; // صعدنا مستويين للوصول للمجلد الذي يحتوي types

export const curriculumData: Record<string, Grade> = {
  "grade1": grade1,
};