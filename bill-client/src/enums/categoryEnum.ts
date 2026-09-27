export const CategoryTypeEnum = {
  INCOME: 1,
  EXPEND: 0
} as const;

export type CategoryType = typeof CategoryTypeEnum[keyof typeof CategoryTypeEnum];
