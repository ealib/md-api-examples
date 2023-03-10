//@ts-check
/* 
 * Copyright (c) 2022, 2023 Emanuele Aliberti, MTKA
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */
'use strict';

import { createRequire } from 'node:module';

/**
 * @type {NodeRequire}
 * @readonly
 */
export const require = createRequire(import.meta.url);

/**
 * @type {string}
 * @readonly
 */
export const moduleName = 'node-mdaemon-api';

/**
 * @typedef { import('node-mdaemon-api') } NodeMDaemonApiModule
 */


/**
 * @param {boolean=} strict OPTIONAL; default false
 * @returns {NodeMDaemonApiModule}
 * @throws
 */
export function loadMDaemonAPI(strict) {
    const md = require('node-mdaemon-api');
    if (!md) {
        throw new Error(`Could not load ${moduleName}!`);
    }
    if (strict) {
        if (!md.versionsMatch) {
            // Early abort!
            throw new Error(`MDaemon version and ${moduleName} version do NOT match!`);
        }
    }
    return md;
}

/**
 * 
 * @param {string} message 
 * @returns {void}
 */
export function printError(message) {
    console.error(`ERROR: ${message}`);
}

/**
 * @returns {void}
 */
export function printErrorNotEvailable() {
    printError('MDaemon not available.');
}

/**
 * Helper to simplify script initialisation.
 * 
 * @param {function} callback to be called if MDaemon is ready
 * @param {boolean=} strict throw error if module's version and MDaemon's don't match
 * @returns {boolean}
 */
export function simpleMain(callback, strict) {
    const md = loadMDaemonAPI(strict);

    if (md.isReady) {
        if (callback) {
            return callback(md);
        } else {
            printError(`missing callback in ${simpleMain.name}`);
        }
    } else {
        printErrorNotEvailable();
    }
    return false;
}

export function yn(flag) {
    return flag ? 'yes' : 'no';
}
