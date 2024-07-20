import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import {firstRow} from "./features";
import ContentBlock from "../../../src/components/contentBlock";
import './index.module.css'

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={"Start"}
      description={
        "Learn about the basics of blockchain and TON and how to get started. TON is blockchain of blockchains with a masterchain to rule them all. You can learn more about general architecture in Basic Concepts section."
      }
    >
      <div className="bootstrap-wrapper">
        <br />
        <h1
          style={{ fontWeight: "650", textAlign: "center", padding: "0 10px" }}
        >
          <span>
            欢迎来到 <br /> TON区块链文档
          </span>{" "}
          <span className="mobile-view">
            欢迎来到 <br /> TON区块链文档
          </span>
        </h1>
        <p style={{ textAlign: "center", fontWeight: "400", fontSize: "18px" }}>
          选择你的路径开始旅程
        </p>

        <div className="container">
          <div id="Get Started" className="row">
            {firstRow &&
              firstRow.length &&
              firstRow.map((props, idx) => (
                <ContentBlock key={idx} {...props} />
              ))}{" "}
          </div>

          <br />
          <p
            style={{
              fontWeight: "300",
              textAlign: "center",
              padding: "10px 0",
              fontSize: "16px",
            }}
          >
            提示：使用<code>Ctrl+K</code>快捷键在任何地方进行搜索
          </p>
        </div>
      </div>
    </Layout>
  );
}
