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

import { simpleMain } from './lib.mjs';

function usersEnumerateRoles(md) {

    const users = md.readUsersSync() ?? [];

    users.forEach((user, index) => {
        const roleList = md.readUserRolesSync(user.Email);
        const roles = (roleList.length > 0) ? roleList.join(', ') : 'no role';
        console.log(`${index}: "${user.FullName}" <${user.Email}> - ${roles}`);
    });
}

simpleMain(usersEnumerateRoles);
