import {add, format} from "date-fns";

export const randomizeValue = (min = 0, max = 1) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const generateArray = (num) => {
  return Array(num).fill(num).map((item, index) => index + 1);
}

export const generateSections = (num = 1000) => {
  const date = new Date(2022, 5, 8);

  return Array(num).fill(num).map((item, index) => {
    return {
      data: generateArray(2).map((item) => {
        return {
          data: generateArray(randomizeValue(1, 5)),
          parentKey: index + 1,
        }
      }),
      key: index + 1,
      date: format(add(date, { days: index }), 'yyyy-MM-dd'),
    }
  });
}
