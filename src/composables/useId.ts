let count = 0;

export const useId = (id?: string) => {
  if (id) return id;
  return `inc-id-${++count}`;
};
