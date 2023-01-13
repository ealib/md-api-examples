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
 * --------------------------------------------------------------------
 * 
 *      WARNING - This is just a proof of concept!
 * 
 *      https://en.wikipedia.org/wiki/Proof_of_concept
 * 
 * --------------------------------------------------------------------
 */
'use strict';

import { Command } from 'commander';
import { printError, simpleMain, } from './lib.mjs';
import { appendFile } from 'node:fs';
import { hostname } from 'node:os';

class MdConfigurationMetadata {
    constructor(md) {
        this.hostname = hostname();
        this.mdaemon = md.getMdInfo();
        this.module = md.getModuleInfo();
        this.timeStamp = new Date();
        this.version = 0;
    }
}

class MdConfiguration {
    #md;
    constructor(md) {
        this.#md = md;
        this.metadata = new MdConfigurationMetadata(md);
        this.domains = [];
        this.gateways = [];
        this.groups = [];
        this.lists = [];
        this.users = [];
        this.readConfiguration();
    }

    stringify(replacer, space) {
        return JSON.stringify(this, replacer, space);
    }

    readConfiguration() {
        this.enumerateDomains();
        this.enumerateGateways();
        this.enumerateGroups();
        this.enumerateLists();
        this.enumerateUsers();
    }

    enumerateDomains() {
        this.#md.MD_GetDomainNames()
            .forEach(name => {
                const info = this.#md.MD_InitDomainInfo(name);
                this.domains.push(info);
            });
    }

    enumerateGateways() {
        this.#md.MD_GetGatewayNames()
            .forEach(name => {
                const info = this.#md.MD_InitGatewayInfo(name);
                this.gateways.push(info);
            });
    }

    enumerateGroups() {
        this.#md.MD_GroupGetAll()
            .forEach(name => {
                const info = MD_GroupInit(name);
                this.groups.push(info);
            });
    }

    enumerateLists() {
        this.#md.MD_ListGetNames()
            .forEach(address => {
                const info = this.#md.MD_InitListInfo(address);
                this.lists.push(info);
            });
    }

    enumerateUsers() {
        const md = this.#md;
        md.readUsersSync()
            .forEach(address => {
                const hUser = md.MD_GetByEmail(address.Email);
                if (this.#md.isBadHandle(hUser)) {
                    printError(`Address <${address}> not found!`);
                } else {
                    const userInfo = md.MD_GetUserInfo(hUser);
                    this.users.push(userInfo);
                    md.MD_GetFree(hUser);
                }
            });
    }
}

function mdConfigExport(md) {
    const program = new Command();

    program
        .name('md-config-export')
        .description('CLI to export MD configuration.')
        .version('1.0.0')
        .requiredOption('--output-file <filename>', 'configuration file to write to');

    program.parse();
    const programOptions = program.opts();

    const mdConfiguration = new MdConfiguration(md);

    // serialize configuration and save to file
    const options = 'utf8';
    appendFile(
        programOptions.outputFile,
        mdConfiguration.stringify(undefined, 5),
        options,
        (err) => {
            if (err) {
                throw err;
            }
            console.log(`MD configuration was appended to file "${programOptions.outputFile}".`);
        });
}

simpleMain(mdConfigExport);
