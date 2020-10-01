# TBTC.insure

A website for purchasing Nexus Mutual insurance as an ERC721 token. Interacts
with yinsure.finance's contract for purchase. Marketplace for reselling coming
soon.

Note: Currently running into rate limiting issues when acquiring quotes. A fix
is in progress.

# Website

This is currently accessible at https://tbtc.insure. Note: you currently need to run a local proxy in order to be able to access this website. You can do so by running:

```
docker run -p 9000:9000 tdickman/tbtc-insure-proxy
```

# Local Dev Usage

* Run `yarn start` to start a development server on `http://localhost:8080/`.
* Run `yarn build` to package your app in a single HTML file that you will find at `dist/index.html`.
* To deploy on Github pages:
  -- Update the homepage tag in `package.json` with your homepage address
  -- Run `yarn deploy`. 


[license]: LICENSE
