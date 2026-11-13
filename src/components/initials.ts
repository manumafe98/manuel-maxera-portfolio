/** The first letter of each word, shown when a Project has no logo. */
export const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("");
