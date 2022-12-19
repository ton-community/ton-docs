import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";

function ConceptImage({src}) {

  let imgUrl = src;

  if (src.indexOf('http') === -1)
    imgUrl = useBaseUrl(src);

  return (
    <img style={{maxWidth: '80%',textAlign: 'center', margin: '10pt auto', display: 'block'}} src={imgUrl}  alt={'concept image'}/>
  );
}

// @ts-ignore
export default ConceptImage