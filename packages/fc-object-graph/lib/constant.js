
var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="constant");
};

template.onLoad = function(pack, tags){with(tags) {

    return {

        tag: SPAN({"class": pack.__KEY__+"constant"},
                  "$node.value"),
        
        shortTag: SPAN({"class": pack.__KEY__+"constant"},
                       "$node.value")
    }    
}};

