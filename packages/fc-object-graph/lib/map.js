
var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="map");
};

template.onLoad = function(pack, tags){with(tags) {

    return {

        CONST_Normal: "tag",
        CONST_Short: "shortTag",

        tag:
            SPAN({"class": pack.__KEY__+"map"}, SPAN("map("),
                FOR("pair", "$node,$CONST_Normal|mapIterator",
                    DIV({"class": "pair"},
                        TAG("$pair.key.tag", {"node": "$pair.key.node"}),
                        SPAN({"class": "delimiter"}, "=>"),
                        TAG("$pair.value.tag", {"node": "$pair.value.node"}),
                        IF("$pair.more", SPAN({"class": "separator"}, ","))
                    )
                ),
            SPAN(")")),


        shortTag:
            SPAN({"class": pack.__KEY__+"map"}, SPAN("map("),
                FOR("pair", "$node,$CONST_Short|mapIterator",
                    SPAN({"class": "pair"},
                        TAG("$pair.key.tag", {"node": "$pair.key.node"}),
                        SPAN({"class": "delimiter"}, "=>"),
                        TAG("$pair.value.tag", {"node": "$pair.value.node"}),
                        IF("$pair.more", SPAN({"class": "separator"}, ","))
                    )
                ),
            SPAN(")")),

        collapsedTag: 
            SPAN({"class": pack.__KEY__+"map"}, SPAN("map("),
                SPAN({"class": "collapsed"}, "... $node|getItemCount ..."),
            SPAN(")")),

        
        getItemCount: function(node) {
            return node.value.length;
        },
        
        mapIterator: function(node, type) {
            var pairs = [];
            for( var i=0 ; i<node.value.length ; i++ ) {
                pairs.push({
                    "key": {
                        "tag": this.getRepForNode(node.value[i][0])[type],
                        "node": node.value[i][0]
                    },
                    "value": {
                        "tag": this.getRepForNode(node.value[i][1])[type],
                        "node": node.value[i][1]
                    },
                    "more": (i<node.value.length-1)
                });
            }
            return pairs;
        }
    }    
}};

