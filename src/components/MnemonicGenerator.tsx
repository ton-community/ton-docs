import React, { useEffect, useState } from "react";
import { generateMnemonic } from "tonweb-mnemonic";
import Markdown from "markdown-to-jsx";

const MnemonicGenerator = () => {
  const [mnemonic, setMnemonic] = useState(['s']);
  const [mnemonicCount, setMnemonicCount] = useState(0);

  useEffect(() => {
    generateMnemonic().then(setMnemonic);
  }, [mnemonicCount]);


  return <>
    <Markdown>**Your mnemonic**:</Markdown>
    <br/>
    <code>{mnemonic.join(' ')}</code>
    <br/>
    <br/>
    <button className="button button--primary button--sm"
      onClick={() => setMnemonicCount((oldCount) => oldCount + 1)}>Regenerate mnemonic
    </button>
  </>;
};

export default MnemonicGenerator;
