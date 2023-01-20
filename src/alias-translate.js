//@ts-check
/* 
 * Copyright (c) 2023 Emanuele Aliberti, MTKA
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

import { Command } from 'commander';
import { printError, simpleMain, } from './lib.mjs';

const program = new Command();

program
    .name('alias-print')
    .description('CLI to expand a MD alias.')
    .version('1.0.0')
    .argument('address', 'alias e-mail address to query MDaemon for');

program.parse();
const args = program.args;

/**
 * Possibly translate an alias address.
 * 
 * @param {import('./lib.mjs').NodeMDaemonApiModule} md 
 * @param {string} address 
 */
function translate(md, address) {
    const self = md.MD_TranslateAlias(address, 0);
    const translated = md.MD_TranslateAlias(address, -1);
    if (self === translated) {
        const hUser = md.MD_GetByEmail(address);
        if (hUser) {
            if (md.isBadHandle(hUser)) {
                printError(`${address} is neither an alias, nor a user.`);
            } else {
                printError(`${address} is a user.`);
                md.MD_GetFree(hUser);
            }
        } else {
            printError('MD_GetByEmail returned undefined');
        }
    } else {
        console.log(`\t${address}  ==>  ${translated}`);
    }
}

/**
 * 
 * @param {import('./lib.mjs').NodeMDaemonApiModule} md 
 */
function aliasTranslate(md) {
    args.forEach(address => {
        console.log(`Translating alias <${address}>:\n`);
        translate(md, address);
    });
}

simpleMain(aliasTranslate);
