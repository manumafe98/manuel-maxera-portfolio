/** The first letters of a name's words, which a Project card shows when the Project has no logo. */
export const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("");
