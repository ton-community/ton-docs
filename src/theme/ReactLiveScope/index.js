import React, {useEffect, useState} from 'react';
import {generateMnemonic} from "tonweb-mnemonic";

function MnemonicGenerator() {
  const [mnemonic, setMnemonic] = useState(['']);
  const [mnemonicCount, setMnemonicCount] = useState(0);

  useEffect(() => {
    generateMnemonic().then(setMnemonic);
  }, [mnemonicCount]);

  return <>
    {mnemonic.join(' ')}
    <br/>
    <button onClick={() => setMnemonicCount((oldCount) => oldCount + 1)}>Regenerate mnemonic</button>
  </>
}

const ReactLiveScope = {
  React,
  ...React,
  MnemonicGenerator,
};
export default ReactLiveScope;
