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
    .name('user-document-list')
    .description('CLI to list a MD user documents in the default document folder.')
    .version('1.0.0')
    .argument('address', 'e-mail address to query MDaemon for');

program.parse();
const args = program.args;

function printDocumentInfo(md, docsPath, docId, index) {
    console.log(`[${1 + index}] "${md.MD_DocumentGetFileName(docsPath, docId)}"`);
    console.log(`    ID............: ${docId}`);
    console.log(`    Size..........: ${md.MD_DocumentGetFileSize(docsPath, docId)}`);
    console.log(`    Modified by...: ${md.MD_DocumentGetModifiedBy(docsPath, docId)}`);
    console.log(`    Modified time.: ${md.MD_DocumentGetModifiedTime(docsPath, docId)}`);
    console.log();
}

function userDocumentList(md) {
    args.forEach(address => {
        const hUser = md.MD_GetByEmail(address);
        const docsPath = md.MD_DocumentGetDefaultFolder(hUser);

        console.log('User default document folder:\n');
        console.log(`  ${address} => "${docsPath}"`);
        console.log();

        const page = 1;
        const pageSize = 64;
        const sort = 'ASC';
        const result = md.MD_DocumentGetMultipleItems(page, pageSize, sort, docsPath);
        if (result.Succeeded) {
            const documentIDs = (result.IDs ?? []).sort();
            if (documentIDs.length) {
                console.log(`Documents in "${docsPath}" (${documentIDs.length}):\n`);
                documentIDs.forEach((docId, index) => printDocumentInfo(md, docsPath, docId, index));
            } else {
                console.log(`No document in "${docsPath}".`);
            }
        } else {
            printError(`${result.ErrorMessage} (${result.ErrorCode}) reading "${docsPath}"`);
        }
    });
}

simpleMain(userDocumentList);
