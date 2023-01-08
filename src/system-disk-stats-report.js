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
import {
    printError,
    require,
    simpleMain,
} from './lib.mjs';

const Handlebars = require("handlebars");
const si = require('systeminformation');

const program = new Command();

program
    .name('system-disk-stats-report')
    .description('CLI command to send a report on local disks.')
    .version('1.0.0')
    .requiredOption('--from <address>', 'the sender of the e-mail message')
    .requiredOption('--to <address>', 'the recipient of the e-mail message')
    .option('--subject <text>', 'the subject of the e-mail message', 'Disk Statistics');

program.parse();
const options = program.opts();

const reportTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{subject}}</title>
  </head>
  <body>
    <h1>{{subject}}</h1>
    <p>MDaemon {{mdInfo.version.full}} runs on <strong>{{osInfo.hostname}}</strong>
    {{osInfo.distro}} {{osInfo.release}} {{osInfo.arch}} (build {{osInfo.build}}).</p>
    <table>
      <thead>
        <th>#</th>
        <th>File System</th>
        <th>Type</th>
        <th>Size</th>
        <th>Used</th>
        <th>Available</th>
        <th>Used</th>
        <th>Mount</th>
      </thead>
      <tbody>
        {{#each fsSize}}
        <tr>
            <td>{{@index}}</td>
            {{#with this}}
            <td>{{fs}}</td>
            <td>{{type}}</td>
            <td>{{size}}</td>
            <td>{{used}}</td>
            <td>{{available}}</td>
            <td>{{use}}%</td>
            <td>{{mount}}</td>
            <td>{{#if mount}}&#9745;{{else}}{{/if}}</td>
            {{/with}}
        </tr>
        {{/each}}
      </tbody>
      <tfoot><small>Generated on {{timestamp}}</small></tfoot>
    </table>
  </body>
</html>`;

function spoolReport(md, mailFrom, mailTo, mailSubject, mailBody) {
    const messageInfo = md.MD_InitMessageInfo();
    if (!messageInfo) {
        printError(`could NOT create a MD_MessageInfo object`);
        return false;
    }
    messageInfo.ContentType = 'text/html';
    messageInfo.From = mailFrom;
    messageInfo.To = mailTo;
    messageInfo.Subject = mailSubject;
    messageInfo.MessageBody = mailBody;
    return md.MD_SpoolMessage(messageInfo);
}

function render(context) {
    const compiledTemplate = Handlebars.compile(reportTemplate);
    return compiledTemplate(context);
}

function systemDiskStatsReport(md) {
    const mailSubject = options.subject;
    const mailFrom = options.from;
    const mailTo = options.to;
    si.osInfo()
        .then(osInfo => {
            si.fsSize()
                .then(fsSize => {
                    const context = {
                        fsSize,
                        mdInfo: md.getMdInfo(),
                        osInfo,
                        subject: mailSubject,
                        timestamp: (new Date()).toISOString(),
                    };
                    const report = render(context);
                    return spoolReport(
                        md,
                        mailFrom,
                        mailTo,
                        mailSubject,
                        report);
                })
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            console.error(error);
        });
}

simpleMain(systemDiskStatsReport);
