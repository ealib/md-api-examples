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
import { loadMDaemonAPI, printError, } from './lib.mjs';

const roUserFlags = '-u|--user <address>';
const roUserDesc = 'Email address to which application password belongs';

const program = new Command();

function getCommandMdArgs(values, strict) {
    const args = program.args;
    const command = args[0];
    console.debug(`---  ${command.toUpperCase()}  ---`);
    const email = values.user;
    const md = loadMDaemonAPI(strict);
    const hUser = md.MD_GetByEmail(email);
    return { args, command, email, md, hUser };
}

function commandList(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        const appPasswordList = md.MD_AppPasswordGetAll(hUser);

        if (Array.isArray(appPasswordList)) {
            if ((appPasswordList.length > 0)) {
                if (values.json) {
                    console.dir(appPasswordList);
                } else {
                    appPasswordList.forEach((ap, index) => {
                        console.log(index + 1, `ID: ${ap.ID}; Created: ${ap.CreatedTime.toISOString()}; Name: "${ap.Name}";`);
                    });
                }
                return;
            }
        }
        console.log(`User "${email}" has no application password.`);
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandAdd(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        const appPassword = {
            ID: '',
            Name: values.name,
            Hash: '',
            LastUsedIP: '',
            CreatedTime: new Date(),
            LastUsedTime: new Date(),
        };
        const password = md.MD_AppPasswordCreate(hUser, appPassword);
        console.log(values.name, '=', password);
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandDelete(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        if (md.MD_AppPasswordDelete(hUser, values.id)) {
            console.log(`application password "${values.id}" deleted.`);
        } else {
            printError(`application password "${values.id}" not found.`);
        }
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandClear(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        if (md.MD_AppPasswordDeleteAll(hUser)) {
            console.log(`all application passwords from "${email}" were deleted.`);
        } else {
            printError(`clearing all application passwords from "${email}" failed.`);
        }
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandQuery(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        const required = md.MD_GetRequireAppPassword(hUser);
        console.log(`application password ${required ? 'is' : 'is not'} required for user "${email}".`);
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandRequired(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        if (md.MD_SetRequireAppPassword(hUser, true)) {
            console.log(`Done.`);
        } else {
            printError(`setting required application password for user "${email}" failed.`);
        }
    } else {
        printError(`unknown user "${email}"`);
    }
}

function commandOptional(values) {
    const { md, email, hUser } = getCommandMdArgs(values, true);
    if (hUser) {
        if (md.MD_SetRequireAppPassword(hUser, false)) {
            console.log(`Done.`);
        } else {
            printError(`setting optional application password for user "${email}" failed.`);
        }
    } else {
        printError(`unknown user "${email}"`);
    }
}

program
    .name('app-password')
    .description('CLI to manage MD application passwords.')
    .version('1.0.0');

program
    .command('list')
    .requiredOption(roUserFlags, 'Email address to which application password(s) belong')
    .option('--json', 'output list in JSON format', false)
    .action(commandList);

program
    .command('add')
    .requiredOption(roUserFlags, roUserDesc)
    .requiredOption('-n|--name <name>', 'application password\'s name')
    .action(commandAdd);

program
    .command('delete')
    .requiredOption(roUserFlags, roUserDesc)
    .requiredOption('--id <id>', 'application password\'s ID')
    .action(commandDelete);

program
    .command('clear',)
    .requiredOption(roUserFlags, roUserDesc)
    .action(commandClear);

program
    .command('query')
    .requiredOption(roUserFlags, roUserDesc)
    .action(commandQuery);

program
    .command('required')
    .requiredOption(roUserFlags, roUserDesc)
    .action(commandRequired);

program
    .command('optional')
    .requiredOption(roUserFlags, roUserDesc)
    .action(commandOptional);

program.parse();
