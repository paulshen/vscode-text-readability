declare module "text-readability" {
  const rs: {
    syllableCount(text: string): number;
    lexiconCount(text: string): number;
    sentenceCount(text: string): number;
    fleschReadingEase(text: string): number;
    fleschKincaidGrade(text: string): number;
    gunningFog(text: string): number;
    smogIndex(text: string): number;
    automatedReadabilityIndex(text: string): number;
    colemanLiauIndex(text: string): number;
    linsearWriteFormula(text: string): number;
    daleChallReadabilityScore(text: string): number;
    textStandard(text: string): number;
  };
  export = rs;
}
