export const getEnumKeyByValue = <T extends { [index: string]: string | number }>(
  enumType: T,
  value: T[keyof T]
): keyof T => {
  const valueIndex = Object.values(enumType).indexOf(value);
  return Object.keys(enumType)[valueIndex];
};
