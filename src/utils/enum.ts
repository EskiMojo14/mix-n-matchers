export interface EnumLike {
  [key: string]: string | number;
  [index: number]: string;
}

export const getValidEnumValues = (obj: EnumLike) => {
  const filtered = Object.fromEntries(
    // filter out reverse mappings
    Object.entries(obj).filter(([, v]) => typeof obj[v] !== "number"),
  );
  return Object.values(filtered);
};
