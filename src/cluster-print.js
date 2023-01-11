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
import { simpleMain, yn } from './lib.mjs';

function clusterPrint(md) {
    const text = `
Clustering
- enabled              : ${yn(md.MD_ClusterGetEnabled())}
- primary node         : ${yn(md.MD_ClusterLocalNodeIsPrimary())}
- primary computer name: ${md.MD_ClusterGetPrimaryComputerName()}
- local node ID        : ${md.MD_ClusterGetLocalNodeId()}
- local server ID      : ${md.MD_ClusterGetLocalServerId()}
- local server UUID    : ${md.MD_ClusterGetLocalServerGUID()}
`;
    console.log(text);
}

simpleMain(clusterPrint);
