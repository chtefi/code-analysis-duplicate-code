import fs from 'fs';
import path from 'path';
import globby from 'globby';
import async from 'async';

/**
 * Read all the .js file in the current folder and return a string that contains
 * all the content of all its files.
 */
export default function getAllFileContentInOneString(folder) {
  return new Promise((resolve, reject) => {
    const jsGlob = [ '**/*.js', '!node_modules/**',  ];
    const options = {};

    globby(jsGlob, { cwd: folder })
      .then(paths => {
        // paths = [ 'a.js' ] 
        // but we want the full path in front of it, we can be outside of '.'
        paths = paths.map(p => path.resolve(folder, p))
        console.log(paths.join('\n'));

        async.map(paths, fs.readFile, (err, results) => {
          if (err) {
            reject(err);
          } else {
            const bigString = results.join('\n');
            resolve(bigString);
          }
        });
    });
  });
}
