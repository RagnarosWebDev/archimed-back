import { Attributes, FindOptions, Op, Order, WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

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

export const getFields = <T extends object>(
  fields: (keyof T)[],
  object: T,
): T => {
  const data = { ...object };
  for (const field in data) {
    if (!fields.includes(field)) delete data[field];
  }

  return data;
};

export const filterNullableOrUndefined = <T>(object: T): T => {
  const data = { ...object };

  for (const field in data) {
    const value = data[field];
    if (value == undefined || value == null) {
      delete data[field];
    }
  }
  return data;
};

export const calculateCountPage = (count: number, delimer = 20) => {
  return Math.floor(count / delimer) + (count % delimer == 0 ? 0 : 1);
};
