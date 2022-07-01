declare module "text-readability" {
  const rs: {
    fleschKincaidGrade(text: string): number;
  };
  export = rs;
}
