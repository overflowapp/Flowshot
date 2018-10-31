# Flowshot [WIP]

[![Build Status](https://travis-ci.com/overflowapp/Flowshot.png?branch=master)](https://travis-ci.com/overflowapp/Flowshot)
<a href="https://codeclimate.com/github/overflowapp/Flowshot/maintainability"><img src="https://api.codeclimate.com/v1/badges/c4cffc3570dddf3eafce/maintainability" /></a>

## Building

1.  Clone repo
2. `cd Flowshot`
3.  `yarn`
4.  `yarn run build` to build the plugin

## Installation

1.  Complete the steps to build the plugin (will create a new `/plugin` folder in the root dir)
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  Switch on **Developer Mode**
4.  Click **Load unpacked extension...** and select the _plugin_ folder from this repo

## Development

Run `yarn run watch` to compile and hot reload the changes whilst the unpacked plugin is loaded in Chrome.

Run `yarn test` to run the Jest/Enzyme test suites.

Run `yarn test --coverage` to run the Jest/Enzyme test suites and create a coverage report.
