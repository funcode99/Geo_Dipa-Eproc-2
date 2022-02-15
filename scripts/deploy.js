"use strict";
const fs = require("fs");
var archiver = require("archiver");
const request = require("request");
const util = require("util");
const execRes = util.promisify(require("child_process").exec);
var output = fs.createWriteStream("build.zip");
var archive = archiver("zip");

async function run() {
  let VERSION = await execRes('grep "REACT_APP_VERSION" .env');
  VERSION = VERSION.stdout.split("=")[1];

  output.on("close", async function() {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed.",
      VERSION
    );

    await execRes("rm build.zip");
  });

  archive.on("error", function(err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory("build", false);
  archive.finalize();
}

run();
