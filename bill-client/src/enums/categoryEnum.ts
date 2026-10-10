export const CategoryTypeEnum = {
  INCOME: 1,
  EXPEND: 0
} as const;

export type CategoryType = typeof CategoryTypeEnum[keyof typeof CategoryTypeEnum];

export const CategoryEnableEnum = {
  ENABLE: 1,
  DISABLE: 0
} as const;

export type CategoryEnable = typeof CategoryEnableEnum[keyof typeof CategoryEnableEnum];

export const checkIsCategoryType = (value: unknown): value is CategoryType => {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  const values = Object.values(CategoryTypeEnum);
  
  return (values as number[]).includes(value);
}
