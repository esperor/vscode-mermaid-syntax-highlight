import * as vscode from 'vscode';
import Formatter from './formatter';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      [{ scheme: 'file', language: 'markdown' }, /* TODO: add support for mmd */],
      {
        provideDocumentFormattingEdits(
          document: vscode.TextDocument,
          options: vscode.FormattingOptions,
        ): vscode.TextEdit[] {
          return new Formatter(context, options).format(document);
        },
      },
    ),
  );
}
