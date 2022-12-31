/* 
 * Copyright (c) 2022 Emanuele Aliberti, MTKA
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

export const moduleName = 'node-mdaemon-api';


/**
 * @param {boolean} strict OPTIONAL; default false
 * @returns any
 */
export function loadMDaemonAPI(strict) {    
    const require = createRequire(import.meta.url);
    const md = require(moduleName);
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
 */
export function printError(message) {
    console.error(`ERROR: ${message}`);
}

export function printErrorNotEvailable() {
    printError('MDaemon not available.');
}