import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const DISPLAY_ATTRIBUTES = new Set(['title', 'placeholder', 'aria-label', 'alt', 'label', 'description', 'emptyText']);
const displayProperties = new Set(['label', 'desc', 'description', 'title', 'hint', 'tooltip', 'emptyText']);
const hasLetters = /[\p{L}]/u;

function jsxText(value) {
  return value.split(/\r?\n/).map((line, i, lines) => {
    let clean = line.replaceAll('\t', ' ');
    if (i !== 0) clean = clean.trimStart();
    if (i !== lines.length - 1) clean = clean.trimEnd();
    return clean;
  }).filter(Boolean).join(' ');
}

export function collectInterfaceCopy(root = 'src') {
  const result = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { if (entry.name !== 'i18n') walk(file); continue; }
      if (!/\.(tsx|ts)$/.test(file)) continue;
      const source = fs.readFileSync(file, 'utf8');
      const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const constants = new Map();
      for (const statement of sf.statements) if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.initializer && (ts.isStringLiteral(declaration.initializer) || ts.isNoSubstitutionTemplateLiteral(declaration.initializer))) constants.set(declaration.name.text, declaration.initializer);
        }
      }
      const at = (node) => ({ file: file.replaceAll('\\', '/'), line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 });
      const add = (node, text, kind) => { if (hasLetters.test(text)) result.push({ ...at(node), text: text.trim(), kind }); };
      function location(node) {
        let inArray = false;
        for (let p = node.parent; p; p = p.parent) {
          if ((ts.isCallExpression(p) || ts.isNewExpression(p)) && /^(?:t|tr|tFeedback|trFeedback|getSpecialConfigDisplay)$|^(?:console\.|invoke\b|sendCliInput\b|localStorage\.)/.test(p.expression.getText(sf))) return null;
          if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(p.operatorToken.kind)) return null;
          if (ts.isJsxAttribute(p)) return DISPLAY_ATTRIBUTES.has(p.name.getText(sf)) ? 'literal' : null;
          if (ts.isArrayLiteralExpression(p)) inArray = true;
          if (ts.isJsxExpression(p)) return !ts.isJsxAttribute(p.parent) || DISPLAY_ATTRIBUTES.has(p.parent.name.getText(sf)) ? (inArray ? 'metadata' : 'literal') : null;
          if (ts.isPropertyAssignment(p)) return displayProperties.has(p.name.getText(sf).replaceAll(/['"]/g, '')) ? 'metadata' : null;
          if ((ts.isCallExpression(p) || ts.isNewExpression(p)) && /^(?:window\.)?(?:alert|confirm|prompt)$|^(?:set\w*(?:Error|Msg|Text|Message|Status)|Error)$/.test(p.expression.getText(sf))) return 'feedback';
          if (ts.isFunctionLike(p) || ts.isVariableDeclaration(p)) break;
        }
        return null;
      }
      function visit(node) {
        if (ts.isJsxText(node)) add(node, jsxText(node.text), 'literal');
        else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && location(node)) add(node, node.text, location(node));
        else if (ts.isTemplateExpression(node) && location(node)) {
          add(node, node.head.text + node.templateSpans.map((span, i) => `{v${i}}${span.literal.text}`).join(''), location(node));
          return;
        }
        if (ts.isCallExpression(node) && /^(t|tr|tFeedback|trFeedback)$/.test(node.expression.getText(sf))) {
          const keys = (value) => {
            if (!value) return;
            if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) add(value, value.text, 'key');
            else if (ts.isIdentifier(value) && constants.has(value.text)) keys(constants.get(value.text));
            else if (ts.isConditionalExpression(value)) { keys(value.whenTrue); keys(value.whenFalse); }
            else if (ts.isBinaryExpression(value) && [ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.BarBarToken].includes(value.operatorToken.kind)) { keys(value.left); keys(value.right); }
          };
          keys(node.arguments[0]);
          for (let p = node.parent; p; p = p.parent) {
            if (ts.isJsxAttribute(p)) {
              if (['key', 'value', 'type', 'id', 'name', 'role', 'status'].includes(p.name.getText(sf))) result.push({ ...at(node), text: node.getText(sf), kind: 'binding' });
              break;
            }
            if (ts.isJsxElement(p) || ts.isFunctionLike(p)) break;
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(sf);
    }
  }
  walk(root);
  return result;
}
