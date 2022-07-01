import * as vscode from "vscode";
import * as rs from "text-readability";

let myStatusBarItem: vscode.StatusBarItem;
const SELECT_SCORE_TYPE_COMMAND_ID = "text-readability.selectScoreType";
const SCORE_TYPE_CONFIGURATION_ID = "textReadability.scoreType";

enum ReadabilityScoreType {
  SyllableCount = "Syllable Count",
  FleschKincaid = "Flesch-Kincaid",
  LexiconCount = "Lexicon Count",
  SentenceCount = "Sentence Count",
  FleschReadingEase = "Flesch Reading Ease",
  FleschKincaidGrade = "Flesch-Kincaid Grade",
  GunningFog = "Gunning Fog",
  SmogIndex = "SMOG Index",
  AutomatedReadabilityIndex = "Automated Readability Index",
  ColemanLiauIndex = "Coleman-Liau Index",
  LinsearWriteFormula = "Linsear Write Formula",
  DaleChallReadabilityScore = "Dale-Chall Readability Score",
  TextStandard = "Text Standard",
}

function calculateScore(text: string, scoreType: ReadabilityScoreType) {
  switch (scoreType) {
    case ReadabilityScoreType.FleschKincaid:
      return rs.fleschKincaid(text);
    case ReadabilityScoreType.LexiconCount:
      return rs.lexiconCount(text);
    case ReadabilityScoreType.SentenceCount:
      return rs.sentenceCount(text);
    case ReadabilityScoreType.FleschReadingEase:
      return rs.fleschReadingEase(text);
    case ReadabilityScoreType.FleschKincaidGrade:
      return rs.fleschKincaidGrade(text);
    case ReadabilityScoreType.GunningFog:
      return rs.gunningFog(text);
    case ReadabilityScoreType.SmogIndex:
      return rs.smogIndex(text);
    case ReadabilityScoreType.AutomatedReadabilityIndex:
      return rs.automatedReadabilityIndex(text);
    case ReadabilityScoreType.ColemanLiauIndex:
      return rs.colemanLiauIndex(text);
    case ReadabilityScoreType.LinsearWriteFormula:
      return rs.linsearWriteFormula(text);
    case ReadabilityScoreType.DaleChallReadabilityScore:
      return rs.daleChallReadabilityScore(text);
    case ReadabilityScoreType.TextStandard:
      return rs.textStandard(text);
    case ReadabilityScoreType.SyllableCount:
    default:
      return rs.syllableCount(text);
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(SELECT_SCORE_TYPE_COMMAND_ID, () => {
      const quickPick = vscode.window.createQuickPick();

      quickPick.items = Object.values(ReadabilityScoreType).map((label) => ({
        label,
      }));
      quickPick.onDidChangeSelection((selection) => {
        if (selection[0]) {
          const scoreType = selection[0].label as ReadabilityScoreType;
          vscode.workspace
            .getConfiguration()
            .update(
              SCORE_TYPE_CONFIGURATION_ID,
              scoreType,
              vscode.ConfigurationTarget.Global
            );
          quickPick.hide();
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    })
  );

  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SCORE_TYPE_CONFIGURATION_ID)) {
        updateStatusBarItem();
      }
    })
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((activeEditor) => {
      updateStatusBarItem();
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
      updateStatusBarItem();
    })
  );
  myStatusBarItem.command = SELECT_SCORE_TYPE_COMMAND_ID;
  updateStatusBarItem();
  context.subscriptions.push(myStatusBarItem);
}

function updateStatusBarItem(): void {
  const text = vscode.window.activeTextEditor?.document.getText();
  if (text === undefined) {
    myStatusBarItem.hide();
    return;
  }
  const scoreType = vscode.workspace
    .getConfiguration()
    .get(
      SCORE_TYPE_CONFIGURATION_ID,
      ReadabilityScoreType.SyllableCount
    ) as ReadabilityScoreType;
  myStatusBarItem.show();
  myStatusBarItem.text = `${scoreType}: ${calculateScore(text, scoreType)}`;
}

export function deactivate() {}
