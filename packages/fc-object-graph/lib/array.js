
var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="array");
};

template.onLoad = function(pack, tags){with(tags) {

    return {

        tag:
            SPAN({"class": pack.__KEY__+"array"}, SPAN("array("),
                FOR("element", "$node|elementIterator",
                    DIV({"class": "element"},
                        TAG("$element.tag", {"node": "$element.node"}),
                        IF("$element.more", SPAN({"class": "separator"}, ","))
                    )
                ),
            SPAN(")")),

        shortTag:
            SPAN({"class": pack.__KEY__+"array"}, SPAN("array("),
                FOR("element", "$node|elementIterator",
                    SPAN({"class": "element"},
                        TAG("$element.tag", {"node": "$element.node"}),
                        IF("$element.more", SPAN({"class": "separator"}, ","))
                    )
                ),
            SPAN(")")),
        
        elementIterator: function(node) {
            var elements = [];
            for( var i=0 ; i<node.value.length ; i++ ) {
                elements.push({
                    "tag": this.getRepForNode(node.value[i]).tag,
                    "node": node.value[i],
                    "more": (i<node.value.length-1)
                });
            }
            return elements;
        }
    }    
}};
