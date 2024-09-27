import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import React from "react";

function ContentBlock({title, status, description, linkUrl, imageUrl}) {
  // const imgUrl = useBaseUrl(imageUrl);
  return (

    <div className="col-md-4 p-8">
      <Link to={useBaseUrl(linkUrl)} activeClassName="active">
        <div className="show-card">
          <div className="icon-wrapper">
            <ThemedImage alt={title} className="icon" sources={{
              light: useBaseUrl(imageUrl.replace('.svg', '-light.svg')),
              dark: useBaseUrl(imageUrl.replace('.svg', '-dark.svg'))
            }} />
          </div>
          <div className="status">{status}</div>
          <div className="title">{title}</div>
          <div className="descriptions">{description}</div>
        </div>
      </Link>
    </div>

  );
}

// @ts-ignore
export default ContentBlock