// بدلاً من ./elementary/grade1 احذف كلمة elementary لأنك في نفس المجلد
import { grade1 } from "./grade1"; 
import { Grade } from "../types"; // بما أن types موجودة في المجلد الأب curriculum-data

export const curriculumData: Record<string, Grade> = {
  "grade1": grade1,
};