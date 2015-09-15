import fs from 'fs';
import globby from 'globby';
import async from 'async';

/**
 * Read all the .js file in the current folder and return a string that contains
 * all the content of all its files.
 */
export default function getAllFileContentInOneString() {
  return new Promise((resolve, reject) => {
    const jsGlob = [ '**/*.js', '!node_modules/**',  ];
    const options = {};
    const createTasksToReadFiles = (files) => files.map(fileName => callback => fs.readFile(fileName, callback));

    globby(jsGlob).then(paths => {
      async.parallel(createTasksToReadFiles(paths), (err, results) => {
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
