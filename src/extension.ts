import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      [{ scheme: 'file', language: 'markdown' }, /* TODO: add support for mmd */],
      {
        provideDocumentFormattingEdits(
          document: vscode.TextDocument,
        ): vscode.TextEdit[] {
          return [];
        },
      },
    ),
  );
}
