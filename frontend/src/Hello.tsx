// src/components/Hello.tsx

import * as React from 'react';

interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
    <div className="greeting">
      Hello123 {name + getExclamationMarks(enthusiasmLevel)}
  </div>
  </div>
);
}

export default Hello;

