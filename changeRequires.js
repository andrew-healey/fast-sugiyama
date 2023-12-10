const fs = require('node:fs').promises;
const path = require('node:path');

const directoryPath = path.join('out', 'node_modules', 'sun-hierarchy', 'dist');

const changeRequires = async () => {
  const recursiveReadDir = async (dir) => {
    let results = [];
    const list = await fs.readdir(dir);
    for (let file of list) {
      file = path.resolve(dir, file);
      const stat = await fs.stat(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(await recursiveReadDir(file));
      } else {
        results.push(file);
      }
    }
    return results;
  };
  const files = await recursiveReadDir(directoryPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));

  for (const file of jsFiles) {
    let fileContent = await fs.readFile(file, 'utf8');

    fileContent = fileContent.replace(/require\((['"])(.+?)\1\)/g, (match, quote, importPath) => {
        const localDir = path.dirname(file);
      const absolutePath = path.resolve(localDir, importPath);
      const relativePathRaw = path.relative('out', absolutePath);
      const relativePath = `./${relativePathRaw}${relativePathRaw.endsWith('.js') ? '' : '.js'}`
      const ret = `require(${quote}${relativePath}${quote})`;
      console.log(`Replaced ${match} with ${ret} in ${file}`);
      return ret;
    });

    await fs.writeFile(file, fileContent);
  }
};

changeRequires().catch(console.error);
