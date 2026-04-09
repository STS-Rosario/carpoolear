const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

class WebpackMultiResolver {

    constructor (options) {
        this.sourceFolder = options.sourceFolder;
        this.targetProject = options.targetProject;
        this.targetDefault = options.targetDefault || 'default';

        this.pattern = new RegExp(this.sourceFolder + path.sep + this.targetDefault);
    }

    apply (compiler) {
        const { NormalModule } = webpack;

        compiler.hooks.compilation.tap('WebpackMultiResolver', (compilation) => {
            NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(
                'WebpackMultiResolver',
                (loaders, module) => {
                    if (this.pattern.test(module.rawRequest)) {
                        const newPath = module.resource.replace(this.targetDefault, this.targetProject);
                        if (fs.existsSync(newPath)) {
                            module.resource = newPath;
                        }
                    }
                }
            );
        });

        compiler.hooks.contextModuleFactory.tap('WebpackMultiResolver', (cmf) => {
            cmf.hooks.beforeResolve.tapAsync('WebpackMultiResolver', (data, callback) => {
                if (this.targetProject && data.request && this.pattern.test(data.request)) {
                    data.request = data.request.replace(this.targetDefault, this.targetProject);
                }
                callback(null, data);
            });
        });
    }
}

module.exports = WebpackMultiResolver;
