npm run build
rm -rf out/node_modules/sun-hierarchy/dist/ && cp -r dist/ out/node_modules/sun-hierarchy/dist/ && rm -rf out/node_modules/sun-hierarchy/dist/test
node changeRequires.js
node fs-to-bundle.js
cp bundleNew.js ../sun-hierarchy-playground/bundle.js
