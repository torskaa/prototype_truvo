// One-time source migration. Copies only the feature dependency graph.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const source = path.resolve('../trading-intelligence');
const requireSource = createRequire(path.join(source, 'package.json'));
const ts = requireSource('typescript');
const target = path.resolve('src/features/market');
fs.mkdirSync(target, { recursive: true });
const input = fs.readFileSync(path.join(source, 'app/page.tsx'), 'utf8');
const ast = ts.createSourceFile('page.tsx', input, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declarations = new Map();
for (const statement of ast.statements) {
  if (statement.name) declarations.set(statement.name.text, statement);
  if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations) if (ts.isIdentifier(d.name)) declarations.set(d.name.text, statement);
}
const selected = new Set();
const identifiers = new Set();
function visit(node) {
  if (ts.isIdentifier(node)) {
    identifiers.add(node.text);
    const declaration = declarations.get(node.text);
    if (declaration && !selected.has(declaration)) { selected.add(declaration); visit(declaration); }
  }
  ts.forEachChild(node, visit);
}
for (const name of ['Explorer', 'Screener', 'indexAsInstrument', 'initialRules']) { const node = declarations.get(name); selected.add(node); visit(node); }
const printer = ts.createPrinter();
const imports = ast.statements.filter(ts.isImportDeclaration).map(node => {
  const clause = node.importClause;
  if (!clause) return node.getText(ast);
  const bindings = clause.namedBindings;
  const kept = bindings && ts.isNamedImports(bindings) ? bindings.elements.filter(e => identifiers.has(e.name.text)) : [];
  const defaultName = clause.name && identifiers.has(clause.name.text) ? clause.name : undefined;
  if (!kept.length && !defaultName) return '';
  const updated = ts.factory.updateImportDeclaration(node, node.modifiers, ts.factory.updateImportClause(clause, clause.isTypeOnly, defaultName, kept.length ? ts.factory.createNamedImports(kept) : undefined), node.moduleSpecifier, node.attributes);
  return printer.printNode(ts.EmitHint.Unspecified, updated, ast);
}).filter(Boolean).join('\n');
const body = ast.statements.filter(s => selected.has(s)).map(s => s.getText(ast)).join('\n\n');
const copied = new Set();
function resolveLocal(specifier, parent) {
  const base = specifier.startsWith('@/') ? path.join(source, specifier.slice(2)) : path.resolve(path.dirname(parent), specifier);
  return [base, `${base}.ts`, `${base}.tsx`, path.join(base,'index.ts'),path.join(base,'index.tsx')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
}
function copyDependencies(text, parent) {
  const file = ts.createSourceFile(parent, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const node of file.statements) {
    if (!(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) || !node.moduleSpecifier) continue;
    const spec = node.moduleSpecifier.text;
    if (!spec.startsWith('@/') && !spec.startsWith('.')) continue;
    const resolved = resolveLocal(spec, parent);
    if (!resolved) throw new Error(`Cannot resolve ${spec} from ${parent}`);
    if (copied.has(resolved)) continue;
    copied.add(resolved);
    const original = fs.readFileSync(resolved,'utf8');
    const output = path.join(target, path.relative(source,resolved));
    fs.mkdirSync(path.dirname(output),{recursive:true});
    fs.writeFileSync(output, original.replaceAll('@/', '@market/'));
    copyDependencies(original,resolved);
  }
}
const views = `${imports}\n\n${body}\n\nexport { Explorer, Screener, indexAsInstrument, initialRules };\n`;
copyDependencies(views,path.join(source,'app/page.tsx'));
for (const entry of ['components/market/instrument-detail.tsx','components/charts/technical-chart-workspace.tsx']) {
  copyDependencies(`import '${'@/'+entry}';`,path.join(source,'app/page.tsx'));
}
fs.writeFileSync(path.join(target,'views.tsx'),views.replaceAll('@/', '@market/'));
let css = fs.readFileSync(path.join(source,'app/globals.css'),'utf8');
css = css.replace(/^@import[^\n]+\n/gm,'');
const theme = css.match(/@theme inline \{[^}]+\}/)?.[0] ?? '';
css = css.replace(theme,'').replace(/:root\s*\{[^}]+\}/,'');
// CSS scope keeps source component classes from changing the host application.
fs.writeFileSync(path.join(target,'market.css'), `${theme.replace(/--font-sans:[^;]+;|--font-mono:[^;]+;/g,'')}\n.market-feature { --background:#f6f5fb; --foreground:#1e1b29; --card:#fff; --primary:#5945f1; color:#1e1b29; color-scheme:light; }\n@scope (.market-feature) {\n${css}\n}\n`);
console.log(`Transferred views and ${copied.size} dependency files.`);
