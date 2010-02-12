

function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };

var TRACE = require("./trace");
var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.onLoad = function(pack, tags){with(tags) {

    return TRACE.onLoad(pack, tags, {
        "class": pack.__KEY__ + "legacy-exception"
    });

}};
