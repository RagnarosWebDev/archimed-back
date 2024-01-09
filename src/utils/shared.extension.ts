import { Attributes, FindOptions, Op, Order, WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { Type } from '@nestjs/common';

export const filteredFields = <T extends Model>(
  keys: (keyof T)[],
  q: string,
  options: WhereOptions<T> = {},
): WhereOptions<T> => {
  const search = [];
  const query = `%${q ? q : ''}%`;

  for (const key of keys) {
    search.push({
      [key]: {
        [Op.iLike]: query,
      },
    });
  }

  return {
    ...options,
    [Op.or]: search,
  };
};

export const rowed = <T extends Model>(
  row = 0,
  options: FindOptions<Attributes<T>> = {},
  limit = 20,
  order: Order = [['id', 'desc']],
): FindOptions<Attributes<T>> => {
  return {
    order: order,
    ...options,
    limit: limit,
    offset: limit * row,
  };
};

export const calculateCountPage = (count: number, delimer = 20) => {
  return Math.floor(count / delimer) + (count % delimer == 0 ? 0 : 1);
};

export const destroyFields = <T>(
  value: T,
  type: Type<T>,
  exclude: (keyof T)[] = [],
): T => {
  const resObj = new type();
  const properties: string[] = Reflect.getMetadata(
    DECORATORS.API_MODEL_PROPERTIES_ARRAY,
    resObj,
  ).map((e: string) => e.substring(1));
  for (const currentProperty in value) {
    if (
      properties.includes(currentProperty) &&
      !exclude.includes(currentProperty)
    ) {
      resObj[currentProperty] = value[currentProperty];
    }
  }
  return resObj;
};

export const excludeFields = <T>(
  value: T,
  type: Type<T>,
  list: (keyof T)[] = [],
): T => {
  const returned = new type();

  for (const field in value) {
    if (!list.includes(field)) {
      returned[field] = value[field];
    }
  }

  return returned;
};
