// curriculum-data/types.ts

export interface Topic {
  id: string;
  title: string;
  pageNumber?: number;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  topics: Topic[];
}

export interface Semester {
  semesterNumber: number; // 1 = الفصل الأول، 2 = الفصل الثاني
  subjects: Subject[];
}

export interface Grade {
  id: string;
  name: string;
  semesters: Semester[];
}