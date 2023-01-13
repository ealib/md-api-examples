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
import { printError, simpleMain } from './lib.mjs';

const program = new Command();

program
    .name('user-print')
    .description('CLI to print a MD user record given its address.')
    .version('1.0.1')
    .argument('address', 'e-mail address to query MDaemon for');

program.parse();
const args = program.args;

function userPrint(md) {
    args.forEach(address => {
        const hUser = md.MD_GetByEmail(address);
        console.log(`${address}:`);
        if (md.isBadHandle(hUser)) {
            printError(`Address <${address}> not found!`);
        } else {
            const userInfo = md.MD_GetUserInfo(hUser);
            console.dir(userInfo);
            md.MD_GetFree(hUser);
        }
        console.log();
    });
}

simpleMain(userPrint);
