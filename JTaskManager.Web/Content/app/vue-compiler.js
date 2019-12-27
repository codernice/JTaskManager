
const fs = require("fs");
const path = require('path');
const cheerio = require('cheerio');
const uglifyJS = require("uglify-js");
const htmlMinify = require('html-minifier').minify;
const babel = require("babel-core");
const less = require('less');

let _fileObject = {};
let watchPath = '.\\';

fs.watch(watchPath, {
    recursive: true,
    encoding: 'utf8'
}, function(event, targetfile) {
    let fileExt = path.extname(targetfile);
    if(fileExt != '.vue') {
        return;
    }

    fs.stat(watchPath + targetfile, function(err, stats) {
        let dt = new Date(stats.ctime || stats.atime);
        let dtTime = dt.getTime();

        if(_fileObject[targetfile] === dt.toUTCString()) {
            return;
        }

        _fileObject[targetfile] = dt.toUTCString();

        if(err) {
            console.error(err);
        } else {
            console.log('\n========= ' + dt + ' ===========');
            console.log(targetfile, 'is', event);

            readFs(targetfile);
        }
    });
});

console.log('vue compiler runing...' + path.resolve(__dirname, watchPath));

function readFs(targetfile) {
    fs.readFile(watchPath + targetfile, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        if (data == "") return;
        try {
            parseHTML(data, targetfile);
        } catch(e) {
            console.error(e);
        }
    });
}

function parseHTML(html, targetfile) {
    const $ = cheerio.load(html);
    let fileName = path.basename(targetfile);
    fileName = fileName.replace('.vue', '.js');
    
    let template_tags = $('template'),
        script_tags = $('script');
        style_tags = $('style');

    let _html = '',
        _script = '',
        _style = '',
        _component = '';
        _exports = '';

    if(template_tags && template_tags.length) {
        _html = template_tags.html();
    }
    if(script_tags && script_tags.length) {
        _script = script_tags.html();
        _component = script_tags.attr('component');
        _exports = script_tags.attr('exports');
    }
    if(style_tags && style_tags.length) {
        _style = style_tags.html();
    }

    let compilerStyle = false;
    let lessToCss = '';

    if(_style) {
        try {
            less.render(_style, {
                compress: true
            }, function(e, output) {
                lessToCss = output.css;
                compilerStyle = true;
            });
        } catch(e) {
            compilerStyle = true;
        }
    } else {
        compilerStyle = true;
    }

    while(true) {
        if(compilerStyle) {
            break;
        }
    }

    if(_html) {
        _html = _html.replace(/&apos;/ig, "\\'");

        _html = htmlMinify(_html, {
            collapseWhitespace: true,
            removeComments: true,
            decodeEntities: true
        });
    }
    if(_script) {
        _script = _script.replace('module.exports', 'var cf');
        if(_html) {
            _script += '\n cf.template = \'' + _html + '\';';
        }
        if(lessToCss) {
            _script += '\n Vue.appendStyle(\'' + lessToCss + '\', \'' + targetfile.replace(/\\/ig, '_') + '\');'
        }

        if(_exports) {
            _script += "\n module.exports = " + _exports + ";";
        } else {
            _script += '\n module.exports = cf;';
        }

        if (_component) {
            _script += "\n Vue.component('" + _component + "', module.exports);";
        }

        let scriptstr = 'define(function(require,exports,module) {';
        scriptstr += _script;
        scriptstr += '\n });';

         let babelRes = babel.transform(scriptstr, {
            extends: __dirname + '/.babelrc',
            // minified: true,
            // filenameRelative: targetfile,
            // sourceMapTarget: targetfile,
            // sourceFileName: targetfile,
            // sourceMaps: true,
            comments: false
        });

        const sourceCode = babelRes.code;
        let codeObj = {};
        codeObj[fileName] = sourceCode;

        var result = uglifyJS.minify(codeObj, {
            sourceMap: {
                filename: fileName,
                url: 'map/' + fileName + '.map'
            },
            mangle: {
                reserved: ["$", "require", "exports", "module"]
            }
        });

        let minifyCode = result.code,
            mapCode = result.map;

        writeSourceFile(targetfile, sourceCode, mapCode, minifyCode);
    }
}

function writeSourceFile(targetfile, sourceCode, mapCode, minifyCode) {
    let fileName = path.basename(targetfile);
    let folder = path.dirname(targetfile);
    let parentFolder = path.dirname(folder);

    let sourcePath = parentFolder + '/map/';

    if(!fs.existsSync(sourcePath)) {
        fs.mkdirSync(sourcePath);
    }

    fileName = fileName.replace('.vue', '.js');
    let filepath = sourcePath + fileName;

    // dist
    fs.writeFile(watchPath + parentFolder + '/' + fileName, minifyCode, 'utf8', (err, written, str) => {
        if(err) {
            console.error(err);
        } else {
            console.log('dist: ' + parentFolder + '/' + fileName);
        }
    });
     // source
    fs.writeFile(watchPath + filepath, sourceCode, 'utf8', (err, written, str) => {
        if(err) {
            console.error(err);
        } else {
            console.log('source finished.');
        }
    });
    // map
    fs.writeFile(watchPath + filepath + '.map', mapCode, 'utf8', (err, written, str) => {
        if(err) {
            console.error(err);
        } else {
            console.log('map finished.');
        }
    }); 
}