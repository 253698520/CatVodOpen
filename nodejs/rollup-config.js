import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {createHash} from 'crypto';
import fs from 'fs';
import * as rollup from 'rollup';

rollup
    .rollup({
      input : [ './src/index.config.js' ],
      plugins : [ commonjs(), json() ],
      onwarn : function(message) { console.log(message.toString()); },
    })
    .then((build) => {
      build
          .write({
            dir : './dist',
            format : 'cjs',
            entryFileNames : '[name].js',
            strict : false,
            plugins : [ genMd5() ],
          })
          .then((output) => {
            console.log(output.output.map((o) => o.fileName));
          });
    });

function genMd5() {
  return {
    name : 'gen-output-file-md5',
    writeBundle() {
      const md5 = createHash('md5')
                      .update(fs.readFileSync('./dist/index.config.js'))
                      .digest('hex');
      fs.writeFileSync('./dist/index.config.js.md5', md5);
    },
  };
}
