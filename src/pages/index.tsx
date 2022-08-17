import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

import { firstRow } from "../data/features";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import styles from './index.module.css';
import useBaseUrl from "@docusaurus/useBaseUrl";


function FirstRow({ title, status, description, linkUrl, imageUrl }) {
    // const imgUrl = useBaseUrl(imageUrl);
    return (

        <div className="col-md-4 p-8">
            <Link to={useBaseUrl(linkUrl)} activeClassName="active">
                <div className="show-card">
                    <div className="icon-wrapper">
                        <ThemedImage alt={title} className="icon"  sources={{
                            light: useBaseUrl(imageUrl.replace('.svg', '-light.svg')),
                            dark: useBaseUrl(imageUrl.replace('.svg', '-dark.svg'))
                        }}/>
                    </div>
                    <div className="status">{status}</div>
                    <div className="title">{title}</div>
                    <div className="descriptions">{description}</div>
                </div>
            </Link>
        </div>

    );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (

      <Layout title={"Start"} description={"Learn about the basics of blockchain and TON and how to get started. TON is blockchain of blockchains with a masterchain to rule them all. You can learn more about general architecture in Basic Concepts section."}>
          <div
              className="bootstrap-wrapper"
          >
              <br/>
              <h1 style={{ fontWeight: '650', textAlign:'center' }}>Welcome to the TON Blockchain documentation</h1>
              <p style={{ textAlign:'center', fontWeight: '400', fontSize:'18px' }}>Choose your path to start journey 🚀</p>

              <div className="container">

                          <div id="Get Started" className="row">
                              {firstRow &&
                                  firstRow.length &&
                                  firstRow.map((props, idx) => (
                                      <FirstRow key={idx} {...props} />
                                  ))}{" "}
                          </div>

                  <br/>
                  <br/>
              </div>
          </div>
      </Layout>
  );
}
