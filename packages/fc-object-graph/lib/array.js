

function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };


var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="array");
};

template.onLoad = function(pack, tags){with(tags) {

    return {

        CONST_Normal: "tag",
        CONST_Short: "shortTag",
        CONST_Collapsed: "collapsedTag",

        tag:
            SPAN({"class": pack.__KEY__+"array"}, SPAN("array("),
                FOR("element", "$node|elementIterator",
                    DIV({"class": "element", "$expandable":"$element.expandable", "_elementObject": "$element", "onclick": "$onClick"},
                        SPAN({"class": "value"},
                            TAG("$element,$CONST_Normal|getTag", {"element": "$element", "node": "$element.node"})
                        ),
                        IF("$element.more", SPAN({"class": "separator"}, ","))
                    )
                ),
            SPAN(")")),

        collapsedTag:
            SPAN({"class": pack.__KEY__+"array"}, SPAN("array("),
                SPAN({"class": "collapsed"}, "... $node|getElementCount ..."),
            SPAN(")")),

        shortTag:
            SPAN({"class": pack.__KEY__+"array"}, SPAN("array("),
                SPAN({"class": "summary"}, "... $node|getElementCount ..."),
            SPAN(")")),

        expandableStub:
            TAG("$element,$CONST_Collapsed|getTag", {"node": "$element.node"}),
            
        expandedStub:
            TAG("$tag", {"node": "$node", "element": "$element"}),


        getElementCount: function(node) {

dump(node);
            
            
            return node.value.length || 0;
        },

        getTag: function(element, type) {
            if(type===this.CONST_Short) {
                return this.getRepForNode(element.node).shortTag;
            } else
            if(type===this.CONST_Normal) {
                if(element.expandable) {
                    return this.expandableStub;
                } else {
                    return this.getRepForNode(element.node).tag;
                }
            } else
            if(type===this.CONST_Collapsed) {
                var rep = this.getRepForNode(element.node);
                if(!rep.collapsedTag) {
                    throw "no 'collapsedTag' property in rep: " + rep.toString();
                }
                return rep.collapsedTag;
            }
        },

        elementIterator: function(node) {
            var elements = [];
            for( var i=0 ; i<node.value.length ; i++ ) {
                elements.push({
                    "node": node.value[i],
                    "more": (i<node.value.length-1),
                    "expandable": this.isExpandable(node.value[i])
                });
            }
            return elements;
        },

        isExpandable: function(node) {
            return (node.type=="reference" ||
                    node.type=="dictionary" ||
                    node.type=="map" ||
                    node.type=="array");
        },
        
        onClick: function(event) {
            if (!this.util.isLeftClick(event)) {
                return;
            }
            var row = this.util.getAncestorByClass(event.target, "element");
            if(this.util.hasClass(row, "expandable")) {
                this.toggleRow(row);
            }
            event.stopPropagation();
        },
        
        toggleRow: function(row)
        {
            var valueElement = this.util.getElementByClass(row, "value");
            if (this.util.hasClass(row, "expanded"))
            {
                this.util.removeClass(row, "expanded");
                this.expandedStub.replace({
                    "tag": this.expandableStub,
                    "element": row.elementObject,
                    "node": row.elementObject.node
                }, valueElement);
            } else {
                this.util.setClass(row, "expanded");
                this.expandedStub.replace({
                    "tag": this.getRepForNode(row.elementObject.node).tag,
                    "element": row.elementObject,
                    "node": row.elementObject.node
                }, valueElement);
            }
        }        
    }    
}};
