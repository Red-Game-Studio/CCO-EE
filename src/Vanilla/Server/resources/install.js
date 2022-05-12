const fs = require("fs")
const p = require("path")

fs.writeFileSync("../../ccods.cmd", `@echo off\nstart node ${p.join(__dirname, "index.js")} %*`) // Windows
fs.writeFileSync("../../ccods", `#!/bin/bash\nnode ${p.join(__dirname, "index.js")} $@`) // Linux