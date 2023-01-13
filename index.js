'use strict';

import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const extJs = '.js';
const srcPath = './src';

readdirSync(srcPath)
    .sort()
    .forEach(fileName => {
        if (extname(fileName) === extJs) {
            console.log('-', join(srcPath, fileName));
        }
    });
