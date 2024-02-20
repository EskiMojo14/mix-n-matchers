export interface EnumLike {
  [key: string]: string | number;
  [index: number]: string;
}

export const getValidEnumValues = (obj: EnumLike) => {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([k]) => {
      const val = obj[k];
      if (typeof val === "undefined") return false;
      // filter out reverse mappings
      return typeof obj[val] !== "number";
    }),
  );
  return Object.values(filtered);
};
