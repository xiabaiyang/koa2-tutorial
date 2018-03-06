const Path = require("path");
const fs = require('fs');

module.exports = function (opts) {
    let { app, rules = []} = opts

    if (!app) {
        throw new Error("the app params is necessary!")
    }

    // 提取出 app 实例对象中的属性名
    const appKeys = Object.keys(app)
    /**
     * [ 'domain',
     '_events',
     '_eventsCount',
     '_maxListeners',
     'proxy',
     'middleware',
     'subdomainOffset',
     'env',
     'context',
     'request',
     'response' ]
     */
    rules.forEach((item) => {
        let { path, name} = item
        // 如果 app 实例中已经存在了传入过来的属性名，则抛出错误
        if (appKeys.includes(name)) {
            throw new Error(`the name of ${name} already exists!`)
        }
        let content = {};
        fs.readdirSync(path).forEach(filename => {
            let extname = Path.extname(filename);
            if (extname === '.js') {
                let name = Path.basename(filename, extname);
                content[name] = require(Path.join(path, filename));
            }
        });
        app[name] = content
    })
}