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

import {
    loadMDaemonAPI,
    printError,
    printErrorNotEvailable,
} from './lib.mjs';


const md = loadMDaemonAPI();

const RESULT_OK = 0;
const RESULT_NOK = 1;
const RESULT_SKIPPED = 2;

/**
 * 
 * @param {string} address - user's address to force TFA
 * @returns {number}
 */
function setTwoFactorAutentication(address) {
    /** @var {number} result */
    let result = RESULT_NOK;

    if (address.startsWith("MDaemon@")) {
        return RESULT_SKIPPED;
    }

    /** @var {buffer} hUser */
    const hUser = md.MD_GetByEmail(address);

    if (md.isBadHandle(hUser)) {
        printError(`BAD user handle for address <${address}>!`);
        return result;
    }

    /** @var {md.MD_UserInfo} userInfo */
    const userInfo = md.MD_GetUserInfo(hUser);
    if (userInfo) {

        /* THIS IS WHERE YOU CHANGE MD_UserInfo object */
        userInfo.RequireTFA = false;

        if (!md.MD_SetUserInfo(hUser, userInfo)) {
            printError(`MD_SetUserInfo failed for address <${address}>!`);
        } else {
            result = RESULT_OK;
        }
    } else {
        printError(`Could not find data for address <${address}>`);
    }

    md.MD_GetFree(hUser);

    return result;
}

if (md.isReady) {
    /** @var {md.UserListItem[]} users */
    const users = md.readUsersSync() ?? [];

    users.forEach(user => {
        const address = user.Email;
        let result;
        switch (setTwoFactorAutentication(address)) {
            case RESULT_OK:
                result = '    SET';
                break;
            case RESULT_NOK:
                result = ' FAILED';
                break;
            case RESULT_SKIPPED:
                result = 'SKIPPED';
                break;
            default:
                result = '???????';
                break;
        }
        console.log(`- ${result} <${address}>`);
    });
} else {
    printErrorNotEvailable();
}