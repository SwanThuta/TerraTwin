import type {HTMLAttributes} from 'react'
type MathAttributes=HTMLAttributes<MathMLElement>&{display?:'block'|'inline';mathvariant?:string;xmlns?:string}
declare module 'react'{
  namespace JSX{
    interface IntrinsicElements{
      math:MathAttributes
      mn:MathAttributes
      mi:MathAttributes
      mo:MathAttributes
      mrow:MathAttributes
      mfrac:MathAttributes
      msqrt:MathAttributes
      msup:MathAttributes
      msub:MathAttributes
      mover:MathAttributes
    }
  }
}
