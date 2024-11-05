const fs = require('fs');
const path = require('path');
const axios = require('axios');
const markdownLinkExtractor = require('markdown-link-extractor');

const directoryPath = 'docs';
const staticPath = 'static';

const isValidUrl = async (url) => {
  try {
    if (["/img", "/example-code-snippets", "/files", "/svg", "/schemes-visio", "/v3/documentation/tvm/instructions", "/hacktonber"].some(val => url.startsWith(val))) {
      return true;
    }
    if (url.startsWith("http")) {
      return true; // ignore http links for now
    } else {
      url = url.split('#')[0].split('?')[0];
      if (url.endsWith('/')) {
        url = url.slice(-1);
      }
      return fs.existsSync(path.join(directoryPath, url + '.md')) ||
        fs.existsSync(path.join(directoryPath, url + '.mdx')) ||
        fs.existsSync(path.join(directoryPath, url, 'README.mdx')) ||
        fs.existsSync(path.join(directoryPath, url, 'README.md')) ||
        fs.existsSync(path.join(staticPath, url));
    }
  } catch (error) {
    return false;
  }
};

const processMarkdownFile = async (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const links = markdownLinkExtractor(fileContent);

  console.log(`Processing file: ${filePath}`);

  const urlChecks = links.map(link => {

    return isValidUrl(link).then(isValid => ({
      url: link,
      isValid,
      filePath
    }));
  });

  const results = await Promise.all(urlChecks);

  results.forEach(({url, isValid, filePath}) => {
    if (!isValid) {
      console.log(`Invalid link found in ${filePath}: ${url}`);
    }
  });


  return results.filter(r => !r.isValid);
};

const checkLinksInDirectory = async (dirPath) => {
  const files = fs.readdirSync(dirPath);

  const total = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      console.log(`Entering directory: ${filePath}`);
      total.push(...await checkLinksInDirectory(filePath)); // Recursively check subdirectories
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) { // Check for both .md and .mdx files
      const res = await processMarkdownFile(filePath);
      total.push(...res);
    }

  }

  return total;
};

(async () => {
  try {
    const total = await checkLinksInDirectory(directoryPath);
    fs.writeFileSync('./invalid.json', JSON.stringify(total), 'utf-8');

  } catch (error) {
    console.error('Error checking links:', error);
  }
})();
