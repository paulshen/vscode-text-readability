// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as rs from "text-readability";

let myStatusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "text-readability" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "text-readability.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from text-readability!"
      );
    }
  );

  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  vscode.window.onDidChangeActiveTextEditor((activeEditor) => {
    console.log("did change", activeEditor);
    updateStatusBarItem(activeEditor?.document.getText());
  });
  vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
    updateStatusBarItem(document.getText());
  });
  myStatusBarItem.command = "text-readability.helloWorld";
  context.subscriptions.push(myStatusBarItem);
  context.subscriptions.push(disposable);
}

function updateStatusBarItem(text: string | undefined): void {
  if (text === undefined) {
    myStatusBarItem.hide();
    return;
  }
  myStatusBarItem.show();
  const score = rs.fleschKincaidGrade(text);
  myStatusBarItem.text = `Flesch Kincaid: ${score}`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
