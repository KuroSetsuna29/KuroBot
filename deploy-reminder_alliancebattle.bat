set command=^
const fs = require('fs');^
const read = require('fs-readdir-recursive');^
const upath = require('upath');^
var zip=new require('node-zip')();^
['async-limiter', 'discord.js', 'long', 'prism-media', 'safe-buffer', 'snekfetch', 'tweetnacl', 'ws'].forEach(node_module =^> {^
read(upath.toUnix('node_modules\\'+node_module)).forEach(file =^> { zip.file(upath.toUnix('node_modules\\'+node_module+'\\'+file), fs.readFileSync(upath.toUnix('node_modules\\'+node_module+'\\'+file))); });^
});^
zip.file('auth.json', fs.readFileSync('auth.json'));^
zip.file('reminder_alliancebattle.js', fs.readFileSync('reminder_alliancebattle.js'));^
var data=zip.generate({base64:false,compression:'DEFLATE'});^
fs.writeFileSync('reminder_alliancebattle.zip',data,'binary');

node -e "%command%"