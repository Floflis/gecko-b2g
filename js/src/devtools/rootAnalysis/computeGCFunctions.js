/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* -*- indent-tabs-mode: nil; js-indent-level: 4 -*- */
"use strict";

loadRelativeToScript('utility.js');
loadRelativeToScript('annotations.js');
loadRelativeToScript('loadCallgraph.js');

if (typeof scriptArgs[0] != 'string')
    throw "Usage: computeGCFunctions.js <callgraph.txt> <out:gcFunctions.txt> <out:gcFunctions.lst> <out:gcEdges.txt> <out:limitedFunctions.lst>";

var start = "Time: " + new Date;

var callgraph_filename = scriptArgs[0];
var gcFunctions_filename = scriptArgs[1] || "gcFunctions.txt";
var gcFunctionsList_filename = scriptArgs[2] || "gcFunctions.lst";
var gcEdges_filename = scriptArgs[3] || "gcEdges.txt";
var limitedFunctionsList_filename = scriptArgs[4] || "limitedFunctions.lst";

loadCallgraph(callgraph_filename);

printErr("Writing " + gcFunctions_filename);
redirect(gcFunctions_filename);

for (var name in gcFunctions) {
    for (const readable of (readableNames[name] || [name])) {
        print("");
        const fullname = (name == readable) ? name : name + "$" + readable;
        print("GC Function: " + fullname);
        let current = name;
        do {
            current = gcFunctions[current];
            if (current in readableNames)
                print("    " + readableNames[current][0]);
            else
                print("    " + current);
        } while (current in gcFunctions);
    }
}

printErr("Writing " + gcFunctionsList_filename);
redirect(gcFunctionsList_filename);
for (var name in gcFunctions) {
    if (name in readableNames) {
        for (var readable of readableNames[name])
            print(name + "$" + readable);
    } else {
        print(name);
    }
}

// gcEdges is a list of edges that can GC for more specific reasons than just
// calling a function that is in gcFunctions.txt.
//
// Right now, it is unused. It was meant for ~AutoRealm when it might
// wrap an exception, but anything held live across ~AC will have to be held
// live across the corresponding constructor (and hence the whole scope of the
// AC), and in that case it'll be held live across whatever could create an
// exception within the AC scope. So ~AC edges are redundant. I will leave the
// stub machinery here for now.
printErr("Writing " + gcEdges_filename);
redirect(gcEdges_filename);
for (var block in gcEdges) {
  for (var edge in gcEdges[block]) {
      var func = gcEdges[block][edge];
    print([ block, edge, func ].join(" || "));
  }
}

printErr("Writing " + limitedFunctionsList_filename);
redirect(limitedFunctionsList_filename);
print(JSON.stringify(limitedFunctions, null, 4));
