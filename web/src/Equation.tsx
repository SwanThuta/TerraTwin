import {parseFormula,type FormulaNode} from './formula'

function Expression({node}:{node:FormulaNode}){
  if(node.kind==='number')return <mn>{node.value}</mn>
  if(node.kind==='identifier'){
    if(node.value==='pi')return <mi>π</mi>
    if(node.value==='zbar')return <mover><mi>z</mi><mo>¯</mo></mover>
    const subscript=node.value.match(/^([A-Za-z])_([A-Za-z0-9]+)$/)
    return subscript?<msub><mi>{subscript[1]}</mi><mi>{subscript[2]}</mi></msub>:<mi mathvariant={node.value.length>1?'normal':undefined}>{node.value}</mi>
  }
  if(node.kind==='negative')return <mrow><mo>−</mo><Expression node={node.argument}/></mrow>
  if(node.kind==='group')return <mrow><mo>(</mo><Expression node={node.argument}/><mo>)</mo></mrow>
  if(node.kind==='call'){
    if(node.name==='sqrt')return <msqrt><Expression node={node.argument}/></msqrt>
    if(node.name==='abs')return <mrow><mo>|</mo><Expression node={node.argument}/><mo>|</mo></mrow>
    return <mrow>{node.name==='atan'?<msup><mi mathvariant="normal">tan</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup>:node.name==='sum'?<mo>∑</mo>:<mi mathvariant="normal">{node.name}</mi>}<mo>(</mo><Expression node={node.argument}/><mo>)</mo></mrow>
  }
  if(node.kind==='binary'){
    if(node.operator==='/'){
      // Keep a scale factor beside the expression: f(x) · 180/π, or 100 · area/valid.
      if(node.left.kind==='binary'&&node.left.operator==='*')return <mrow><Expression node={node.left.left}/><mo>·</mo><mfrac><Expression node={node.left.right}/><Expression node={node.right}/></mfrac></mrow>
      return <mfrac><Expression node={node.left}/><Expression node={node.right}/></mfrac>
    }
    if(node.operator==='^')return <msup><Expression node={node.left}/><Expression node={node.right}/></msup>
    return <mrow><Expression node={node.left}/><mo>{node.operator==='*'?'·':node.operator==='-'?'−':node.operator}</mo><Expression node={node.right}/></mrow>
  }
}
export function ReviewRule({rule}:{rule:string}){
  const expression=parseFormula(rule)
  return expression?<div className="criterion-equation"><math display="block" aria-label={rule}><Expression node={expression}/></math><details className="formula-source"><summary>Original rule</summary><code>{rule}</code></details></div>:<p>{rule||'No review rule supplied.'}</p>
}
