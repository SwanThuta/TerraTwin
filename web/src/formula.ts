/** Display-only arithmetic syntax. Nothing here evaluates or changes a rating. */
export type FormulaNode = {kind:'number'|'identifier';value:string}|{kind:'binary';operator:string;left:FormulaNode;right:FormulaNode}|{kind:'call';name:string;argument:FormulaNode}|{kind:'group'|'negative';argument:FormulaNode}
const functions=new Set(['atan','sqrt','sum','max','min','abs','sin','cos','tan','log','exp'])
export function parseFormula(source:string):FormulaNode|null{
  if(!/[*/^]|\b(?:atan|sqrt|sum|max|min)\(/.test(source))return null
  const tokens=source.match(/[A-Za-z_][A-Za-z_0-9]*|\d+(?:\.\d+)?|[()+\-*/^]/g)||[]
  if(tokens.join('')!==source.replace(/\s/g,''))return null
  let index=0
  function primary():FormulaNode{
    const token=tokens[index++]
    if(!token)throw Error('Missing operand')
    if(token==='('){const argument=addition();if(tokens[index++]!==')')throw Error('Unclosed group');return {kind:'group',argument}}
    if(/^\d/.test(token))return {kind:'number',value:token}
    if(/^[A-Za-z_]/.test(token)){
      if(tokens[index]==='('){if(!functions.has(token))throw Error('Unknown function');index++;const argument=addition();if(tokens[index++]!==')')throw Error('Unclosed function');return {kind:'call',name:token,argument}}
      return {kind:'identifier',value:token}
    }
    throw Error('Invalid operand')
  }
  function power():FormulaNode{const left=primary();if(tokens[index]==='^'){index++;return {kind:'binary',operator:'^',left,right:unary()}}return left}
  function unary():FormulaNode{if(tokens[index]==='-'){index++;return {kind:'negative',argument:unary()}}return power()}
  function multiplication():FormulaNode{let left=unary();while(['*','/'].includes(tokens[index])){const operator=tokens[index++];left={kind:'binary',operator,left,right:unary()}}return left}
  function addition():FormulaNode{let left=multiplication();while(['+','-'].includes(tokens[index])){const operator=tokens[index++];left={kind:'binary',operator,left,right:multiplication()}}return left}
  try{const expression=addition();return index===tokens.length?expression:null}catch{return null}
}
