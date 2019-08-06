let fs = require('fs');
let path = require('path');

class WebpackMultiResolver {

    constructor (options) {
        this.sourceFolder = options.sourceFolder;
        this.targetProject = options.targetProject;
        this.targetDefault = options.targetDefault || 'default';

        this.pattern = new RegExp(this.sourceFolder + path.sep + this.targetDefault);
    }

    apply (compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('normal-module-loader', (loaderContext, module) => {
                if (this.pattern.test(module.rawRequest)) {
                    let newPath = module.resource.replace(this.targetDefault, this.targetProject);
                    if (fs.existsSync(newPath)) {
                        module.resource = newPath;
                    }
                }
            });
        });
        compiler.plugin('context-module-factory', (cmf) => {
            cmf.plugin('before-resolve', (result, callback) => {
                if (this.targetProject && this.pattern.test(result.request)) {
                    result.request = result.request.replace(this.targetDefault, this.targetProject);
                }
                callback(null, result);
            });
            cmf.plugin('after-resolve', (result, callback) => {
                return callback(null, result);
            });
        });
    }
}

module.exports = WebpackMultiResolver;
