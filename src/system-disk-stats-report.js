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
    .version('1.0.1')
    .requiredOption('--from <address>', 'the sender of the e-mail message')
    .requiredOption('--to <address>', 'the recipient of the e-mail message')
    .option('--subject <text>', 'the subject of the e-mail message', 'Disk Statistics');

program.parse();
const options = program.opts();

const reportTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{subject}}</title>
    <style>
    body {
      font-family: sans-serif;
      font-size: 12pt;
    }
    table {
      border-collapse: collapse;
      border: 1px solid black;
      text-align: center;
      vertical-align: middle;
    }
    caption {
      font-weight: bold;
      font-size: 20pt;
      text-align: left;
      color: #333;
      margin-bottom: 8px;
    }
    th, td {
      border: 1px solid black;
      padding: 4px;
    }
    td.counter {
        text-align: right;
    }
    </style>
  </head>
  <body>
    <p>MDaemon {{mdInfo.version.full}} runs on <strong>{{osInfo.hostname}}</strong>.</p>
    <p><strong>{{osInfo.hostname}}</strong> runs {{osInfo.distro}} {{osInfo.release}} {{osInfo.arch}} (build {{osInfo.build}}).</p>
    <table>
      <caption>{{subject}}</caption>
      <thead>
        <th>#</th>
        <th>File System</th>
        <th>Type</th>
        <th>Size</th>
        <th>Used</th>
        <th>Available</th>
        <th>Used</th>
        <th>Mount</th>
        <th>R/W</th>
      </thead>
      <tbody>
        {{#each fsSize}}
        <tr>
            <td>{{@index}}</td>
            {{#with this}}
            <td>{{fs}}</td>
            <td>{{type}}</td>
            <td class="counter">{{size}}</td>
            <td class="counter">{{used}}</td>
            <td class="counter">{{available}}</td>
            <td class="counter">{{use}}%</td>
            <td>{{mount}}</td>
            <td>{{#if mount}}&#9745;{{else}}{{/if}}</td>
            {{/with}}
        </tr>
        {{/each}}
      </tbody>
    </table>
    <p><small><small>Generated at {{timestamp}}.</small></small></p>
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
