export const reverseToNormalDate = (value: string): string => {
  const regex =
    /^(?<year>19[0-9][0-9]|20[012][0-9])(?<month>0[1-9]|1[0-2])(?<day>0[1-9]|[12][0-9]|3[01])$/;

  const { year, month, day } = value.match(regex).groups;

  return `${day}/${month}/${year}`;
};
