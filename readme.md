# util-cli

Some useful util functions for CLI tools.

## Install

    $ npm install util-cli

## Usage

```javascript
var utils = require('util-cli);
console.log(utils.resolve('npm'));
require('child_process').execFile(utils.editor(), ['~/.bashrc'], function () {
    console.log('Editing complete!');
});
if (util.spawnSync('npm', ['install', 'util-cli'], { stdio: 'inherit' }) != 0) {
    console.log('Installation error');
}
```

## License

Copyright (c) 2015, Mykhailo Stadnyk

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
