import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import {firstRow} from "../data/features";
import ContentBlock from "@site/src/components/contentBlock";
import './index.module.css'

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

    <Layout title={"Start"} description={"Explore TON Blockchain fundamentals and get started. You can learn more about the general architecture in Concepts section."}>
      <div
        className="bootstrap-wrapper"
      >
        <br/>
        <h1 style={{ fontWeight: '650', textAlign:'center', padding: '0 10px' }}><span>Welcome to TON <br/> Blockchain documentation </span> <span className='mobile-view'>Welcome to <br/> TON Blockchain <br/> documentation</span></h1>
        <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start your journey</p>

        <div className="container">

          <div id="get-started" className="row">
            {firstRow &&
                                  firstRow.length &&
                                  firstRow.map((props, idx) => (
                                    <ContentBlock key={idx} {...props} />
                                  ))}
          </div>

          <br/>
          <p style={{ fontWeight: '300', textAlign:'center', padding: '10px 0', fontSize:'16px' }}>Tip: search everywhere with <code>Ctrl+K</code> (or <code>Cmd+K</code> on macOS) hotkey</p>
        </div>
      </div>
    </Layout>
  );
}
