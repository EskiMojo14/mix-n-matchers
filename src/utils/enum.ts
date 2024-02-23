export interface EnumLike {
  [key: string]: string | number;
  [index: number]: string;
}

export const getValidEnumValues = (obj: EnumLike) =>
  Object.values(obj).filter((v) => typeof obj[v] !== "number");
