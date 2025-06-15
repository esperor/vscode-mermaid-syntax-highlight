import * as vscode from 'vscode';

const OPENING_TAGS = ['stateDiagram', 'stateDiagram-v2'];
const OPENING_BRACE = '{';
const CLOSING_BRACE = '}';

class Formatter {
  options: vscode.FormattingOptions;
  context: vscode.ExtensionContext;

  constructor(
    context: vscode.ExtensionContext,
    options: vscode.FormattingOptions,
  ) {
    this.context = context;
    this.options = options;
  }

  isLineIndentedCorrectly = (
    line: vscode.TextLine,
    correctNestingLevel: number,
  ): boolean => {
    const indentation = line.firstNonWhitespaceCharacterIndex;
    const expectedIndentation = this.options.insertSpaces
      ? this.options.tabSize * correctNestingLevel
      : correctNestingLevel;

    return indentation === expectedIndentation;
  };

  formatCodeLine = (
    line: vscode.TextLine,
    nestingLevel: number,
  ): vscode.TextEdit[] => {
    const edits: vscode.TextEdit[] = [];

    if (!this.isLineIndentedCorrectly(line, nestingLevel)) {
      const insertString = this.options.insertSpaces
        ? ' '.repeat(this.options.tabSize * nestingLevel)
        : '\t'.repeat(nestingLevel);

      edits.push(
        vscode.TextEdit.replace(
          new vscode.Range(
            line.range.start,
            line.range.start.translate(
              0,
              line.firstNonWhitespaceCharacterIndex,
            ),
          ),
          insertString,
        ),
      );
    }

    return edits;
  };

  format = (document: vscode.TextDocument): vscode.TextEdit[] => {
    const edits: vscode.TextEdit[] = [];
    var schemeCodeStartLine: number;

    var nestingLevel = 1;

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (OPENING_TAGS.some((tag) => line.text.startsWith(tag))) {
        schemeCodeStartLine = i;
      }
      if (schemeCodeStartLine === undefined || i === schemeCodeStartLine)
        continue;
      if (line.text.startsWith('```') && schemeCodeStartLine !== undefined)
        break;

      if (line.text.trimStart().startsWith(CLOSING_BRACE)) nestingLevel--;

      edits.push(...this.formatCodeLine(line, nestingLevel));

      if (line.text.trimEnd().endsWith(OPENING_BRACE)) nestingLevel++;
    }
    return edits;
  };
}

export default Formatter;
