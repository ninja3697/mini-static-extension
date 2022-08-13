export const getThemeFromVSCodeActiveThemeType = (kind: number): string => {
  switch (kind) {
    case 1:
    case 4:
      return 'light';
    default:
      return 'dark';
  }
};
