/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/*
 * https://nextjs.org/docs/api-reference/next.config.js/introduction
 * 'next.config.js' is a regular Node.js module, not a JSON file.
 * It gets used by the Next.js server and build phases, and it's
 * not included in the browser build.
 */

const sdkPackage = require('./node_modules/@oracle/content-management-sdk/package.json');

const BUILD_TAG = process.env.BUILD_TAG || 'none';
const SDK_VERSION = sdkPackage.version;

/*
 * Gets the BASE_URL from the command used to start this app.
 * If BASE_URL is specified but it does not start with a "/"  then add it.
 */
function getBaseUrl() {
  let baseUrl = '';

  if (process.env.BASE_URL) {
    if (process.env.BASE_URL.startsWith('/')) {
      baseUrl = process.env.BASE_URL;
    } else {
      baseUrl = `/${process.env.BASE_URL}`;
    }
  }

  return baseUrl;
}

module.exports = {
  // This is needed when you are running you application with a reverse
  // proxy, this has to be the same value as what you put in your reverse
  // proxy so that the pages, components, and scripts are located.
  assetPrefix: getBaseUrl(),

  // This variable is used in this application in <Link>s. This is so when
  // this application is deployed in a server which has a reverse proxy,
  // the Links have the correct path to the resource. Without this set links
  // will not work
  // For example : if the reverse proxy is passing
  // "http://myhost/samples/oce-nextjs-minimal-sample/" on to "http://myhost",
  // the link to the "contact" page has to be "http://myhost/tutorialsoce-nextjs-minimal-sample/contact"
  // so the reverse proxy will forward it on to "http://myhost/contact"
  publicRuntimeConfig: {
    basePath: getBaseUrl(),
  },

  // make server environment variables accessible in the app even in the client bundle
  // variables with the prefix NEXT_PUBLIC_ will be available in the browser application
  env: {
    NEXT_PUBLIC_BUILD_TAG: BUILD_TAG,
    NEXT_PUBLIC_SDK_VERSION: SDK_VERSION,
    NEXT_PUBLIC_SERVER_URL: process.env.SERVER_URL,
    NEXT_PUBLIC_API_VERSION: process.env.API_VERSION,
    NEXT_PUBLIC_CHANNEL_TOKEN: process.env.CHANNEL_TOKEN,
    NEXT_PUBLIC_AUTH: process.env.AUTH,
    NEXT_PUBLIC_PREVIEW: process.env.PREVIEW,
    NEXT_PUBLIC_CLIENT_ID: process.env.CLIENT_ID,
    NEXT_PUBLIC_CLIENT_SECRET: process.env.CLIENT_SECRET,
    NEXT_PUBLIC_CLIENT_SCOPE_URL: process.env.CLIENT_SCOPE_URL,
    NEXT_PUBLIC_IDCS_URL: process.env.IDCS_URL,
  },

  // Add webpack exclusions to to allow it to integrate https-proxy-agent in non server context
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.fallback = {
        // assert, net, tls needed for 'https-proxy-agent' dependency
        assert: false,
        net: false,
        tls: false,
        http: false,
        https: false,
      };
    }

    return config;
  },

};
