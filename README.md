# node-mdaemon-api examples

## Goal

This repository has the sole purpose of collecting ECMAScript,
JavaScript, TypeScript scripts that can be used to solve small problems,
or to complete repetitive tasks in the management of MDaemon.

All scripts are not generic scripts, but use the native
[`node-mdaemon-api`](https://www.npmjs.com/package/node-mdaemon-api)
module that exposes a subset of MDaemon's native API to the Node.js
world.

> **WARNING**
>
> [`node-mdaemon-api`](https://www.npmjs.com/package/node-mdaemon-api)
> is not ready for production yet. Please, only install and use these
> scripts on Mdaemon test systems. Not on production systems.

## List of example scripts

| Script                        | Description                                                      |
|-------------------------------|------------------------------------------------------------------|
| `cluster-print.js`            | Print a summary of local node clustering configuration           |
| `domains-enumerate.js`        | Enumerate all domains defined in MDaemon                         |
| `list-print.js`               | Print an MDaemon's internal record for a list, given its address |
| `lists-enumerate.js`          | Enumerate all mailing lists defined in MDaemon                   |
| `md-restart.js`               | Request MDaemon to restart (via semaphore file)                  |
| `md-shutdown.js`              | Request MDaemon to shutdown (via semaphore file)                 |
| `module-print.js`             | Print the `node-mdaemon-api` module object as seen by Node.js    |
| `system-disk-stats-report.js` | Send a report with logical disks statistics                      |
| `system-print.js`             | Print information about host, OS, Node.js, `node-mdaemon-api`    |
| `user-print.js`               | Print an MDaemon's internal record for a user, given its address |
| `users-enumerate.js`          | Enumerate all users defined in MDaemon                           |
| `users-require-2fa.js`        | Require Two-Factors Authentication on all MDaemon users          |

## Contributing

Please
[create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
if you intend to contribute a finished, working script.

If you need to contact me, or would like to discuss possible ideas for
useful scripts in the handling of MDaemon, there is the
[developers room on Matrix](https://matrix.to/#/#mdaemon-dev:matrix.org).

## Legal

Copyright &copy; 2022, 2023 Emanuele Aliberti, MTKA

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
