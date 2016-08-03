# How to run

* Install node.js (latest 0.12.x version)
* Install git command line tools
* `npm install -g grunt-cli`
* `npm install -g bower`
* `npm install -g sass-lint`
* `git clone https://github.com/aestrada7/accounting-js.git`
* `cd accounting-js`
* `npm install`
* `grunt update`
* `grunt develop` for English or `grunt develop-es` for the Spanish version
* nw.exe will load automatically
* Prior to commiting any changes run `grunt pre-commit`, this will run `ESLint` and `SCSS Lint` to make sure there are no issues with the code.

This app uses nw.js, grunt update fetches the branches from git, installs all bower components, installs npm packages.

Sit back, relax. Let grunt update and grunt develop do all the heavy lifting.