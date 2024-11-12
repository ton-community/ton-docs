import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import ContentBlock from "@site/src/components/contentBlock";
import './index.module.css'

const content = [
  {
    title: "What is Hacktoberfest?",
    status: "Everyone curious about TON",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Read more about the event and why it's so cool to start right now!"
  },
  {
    title: "Contribute to TON",
    status: "Open-source Developer",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022/as-contributor",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Participate in open-source and receive cool rewards from TON."
  },
  {
    title: "Prepare Repository",
    status: "Open-source Maintainer",
    linkUrl: "/v3/documentation/archive/hacktoberfest-2022/as-maintainer",
    imageUrl: "img/ton_symbol_old.svg",
    description: "Improve your open-source project with help of active TON community."
  },
];



export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

    <Layout title={"Hack-TON-berfest 🎃"} description={"Welcome to Hack-TON-berfest! Join a month-long celebration of open-source projects, their maintainers, and the entire community of contributors! Each October, open source maintainers give new contributors extra attention as they guide developers through their first pull requests."}>
      <div
        className="bootstrap-wrapper"
      >
        <br/>
        <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Welcome to Hack-TON-berfest 🎃</h1>
        <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start journey:</p>

        <div className="container">

          <div id="Get Started" className="row">
            {content &&
                            content.length &&
                            content.map((props, idx) => (
                              <ContentBlock key={idx} {...props} />
                            ))}{" "}
          </div>

          <br/>
          <br/>

          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>List of repositories to Contribute 🛠</h1>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Here is a list of repositories in TON Ecosystem who awaits of contributors right now:</p>

          <iframe className="airtable-embed"
            src="https://airtable.com/embed/shrVIgLZqTdFtXFaZ?backgroundColor=blue&viewControls=on"
            frameBorder="0" width="100%" height="533"
            style={{background: 'transparent', border: '1px solid #ccc'}}></iframe>

          <br/>
          <br/>

          <h2 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Want to join to this list? 🚀</h2>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Please, read the page for maintainers and fill the form — <a href={"/contribute/hacktoberfest/as-maintainer"}>join as maintainer</a>. It's easy now!</p>

          <br/>
          <br/>


          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>Claim your NFT as proof of participating 💎</h1>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px',maxWidth:'600px', margin:'0 auto' }}>Every participant (maintainer and contributor) to any of TON Ecosystem projects will receive <b><a href="/contribute/hacktoberfest/#what-the-rewards">Limited Hack-TON-berfest NFT</a></b>:</p>

          <div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
            <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'30pt auto 20pt'}} muted={true} autoPlay={true} loop={true}>
              <source src="/files/nft-sm.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
            </video>
          </div>

          <br/>

          <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}>FAQ for Contributors</h1>

          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Before asking any question in the chats, please read answers here first.</p>
          <iframe className="airtable-embed"
            src="https://airtable.com/embed/shrmS5ccK1Ez8Zc7q/tbldsJlX5kJoVXV48?backgroundColor=blue&viewControls=on"
            frameBorder="0" width="100%" height="533"
            style={{background: 'transparent', border: '1px solid #ccc'}}></iframe>

          <br/>
          <br/>
          <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>If you have any specific questions, feel free to ask in <a href={"https://t.me/TonDev_eng"}>TON Dev Chat</a> to get help.</p>

          <br/>
          <br/>

        </div>
      </div>


    </Layout>
  );
}
