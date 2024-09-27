import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";

function ConceptImage({src, style}) {

  let imgUrl = src;
  let imgStyle = style;

  if (imgStyle === undefined) {
    imgStyle = {maxWidth: '80%',textAlign: 'center', margin: '10pt auto', display: 'block'}
  }

  if (src.indexOf('http') === -1)
    imgUrl = useBaseUrl(src);

  return (
    <img style={imgStyle} src={imgUrl}  alt={'concept image'}/>
  );
}

// @ts-ignore
export default ConceptImage
