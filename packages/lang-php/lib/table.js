

function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };


var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="table");
};

template.onLoad = function(pack, tags){with(tags) {

    return {

        tag: DIV({"class": pack.__KEY__+"table __fc_no_inspect"},
                 DIV({"class": "head", "_dataNode": "$node"},
                     A({"class": "title", "onclick": "$toggleBody"}, "$node|getCaption")
             )),

        infoTag: DIV({"class": "info"},
                     TABLE({"cellpadding": 3, "cellspacing": 0},
                         TBODY(
                             TR(
                                 FOR("column", "$node|getHeaderColumns",
                                    TD({"class":"header"}, "$column")
                                 )
                             ),
                             FOR("row", "$node|getRows",
                                 TR({},
                                     FOR("column", "$row|getColumns",
                                         TD({"class":"cell", "_dataNode": "$column.value", "onclick": "$onClick"},
                                             TAG("$column.tag", {"node": "$column.value"})
                 ))))))),
                      
        getCaption: function(node)
        {
            try {
                return node.value[0].value;
            } catch(e) {
                pack.logger.error(e);
            }
        },
        
        toggleBody: function(event)
        {
            var target = event.currentTarget;
            var logRow = this.util.getAncestorByClass(target, pack.__KEY__+"table");
            if (this.util.isLeftClick(event)) {
                this.util.toggleClass(logRow, "opened");
                if (this.util.hasClass(logRow, "opened")) {
                    if (!this.util.getChildByClass(logRow, "head", "info")) {
                        this.infoTag.append({
                            "node": this.util.getChildByClass(logRow, "head").dataNode
                        }, this.util.getChildByClass(logRow, "head"));
                    }
                }
            }
        },

        getHeaderColumns: function(node)
        {
            try {
                var columns = [];
                node.value[1].value[0].value.forEach(function(column) {
                    columns.push(column.value);
                });
                return columns;
            } catch(e) {
                pack.logger.error(e);
            }
            return [];
        },

        getRows: function(node)
        {
            try {
                return node.value[1].value.slice(1);
            } catch(e) {
                pack.logger.error(e);
            }
            return [];
        },

        getColumns: function(row)
        {
            var self = this;
            try {
                var columns = [];
                row.value.forEach(function(column) {
                    columns.push({
                        "tag": self.getRepForNode(column).shortTag,
                        "value": column
                    });
                });
                return columns;
            } catch(e) {
                pack.logger.error(e);
            }
            return [];            
        },
        
        onClick: function(event) {
            pack.dispatchEvent('inspectNode', {
                "node": event.currentTarget.dataNode
            });
        }
    }
}};
