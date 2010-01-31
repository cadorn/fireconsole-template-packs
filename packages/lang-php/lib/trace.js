

function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };


var TEMPLATE = require("template", "template-pack");
var template = exports.template = TEMPLATE.Template(module);

template.supportsNode = function(node) {
    return (node.type=="trace");
};

exports.onLoad = template.onLoad = function(pack, tags, options){with(tags) {

    return {

        tag: DIV({"class": pack.__KEY__+"trace __fc_no_inspect" +
                  ((options && options["class"])?" "+options["class"]:"")},
                 DIV({"class": "head", "_dataNode": "$node"},
                    A({"class": "title", "onclick": "$onToggleBody"}, "$node|getCaption"))
             ),
        
        infoTag: DIV({"class": "info"},
                    TABLE({"cellpadding": 3, "cellspacing": 0},
                        TBODY(
                            TR(
                                TD({"class": "headerFile"}, "File"),
                                TD({"class": "headerLine"}, "Line"),
                                TD({"class": "headerInst"}, "Instruction")
                            ),
                            FOR("frame", "$node|getCallList",
                                TR(
                                    TD({"class": "cellFile"}, DIV("$frame.file")),
                                    TD({"class": "cellLine"}, DIV("$frame.line")),
                                    TD({"class": "cellInst"},
                                        DIV("$frame|getFrameLabel(",
                                            FOR("arg", "$frame|argIterator",
                                                TAG("$arg.tag", {"node": "$arg.value"}),
                                                IF("$arg.more", SPAN({"class": "separator"}, ","))),
                                        ")")
                                    )))))),


        getCaption: function(node)
        {
            try {
                var data = node.getInstance().value;
                if (data.Class && data.Type.value == 'throw') {
                    return data.Class.value + ': ' + data.Message.value;
                } else
                if (data.Class && data.Type.value == 'trigger') {
                    return data.Message.value;
                } else {
                    return data.Message.value;
                }
            } catch(e) {
                pack.logger.error(e);
            }
        },
        
        onToggleBody: function(event)
        {
            var target = event.currentTarget;
            var logRow = this.util.getAncestorByClass(target, pack.__KEY__+"trace");
            if(this.util.isLeftClick(event)) {
                this.util.toggleClass(logRow, "opened");
                if(this.util.hasClass(logRow, "opened")) {
                    if(!this.util.getChildByClass(logRow, "head", "info")) {
                        this.infoTag.append({
                            "node": this.util.getChildByClass(logRow, "head").dataNode
                        }, this.util.getChildByClass(logRow, "head"));
                    }
                }
            }
        },
        
        getCallList: function(node)
        {
            try {
                var data = node.getInstance().value,
                    list = [{
                        'file': (data.File)?data.File.value:"",
                        'line': (data.Line)?data.Line.value:"",
                        'class': (data.Class)?data.Class.value:"",
                        'function': (data.Function)?data.Function.value:"",
                        'type': (data.Type)?data.Type.value:"",
                        'args': (data.Args)?data.Args.value:false
                    }];

                data.Trace.value.forEach(function(frame) {
                    frame = frame.getInstance().value;
                    list.push({
                        'file': (frame.file)?frame.file.value:"",
                        'line': (frame.line)?frame.line.value:"",
                        'class': (frame["class"])?frame["class"].value:"",
                        'function': (frame["function"])?frame["function"].value:"",
                        'type': (frame.type)?frame.type.value:"",
                        'args': (frame.args)?frame.args.value:false
                    });
                });

                /* Now that we have all call events, lets sew if we can shorten the filename.
                * This only works for unif filepaths for now.
                * TODO: Get this working for windows filepaths as well.
                */
                try {
                    if (list[0].file.substr(0, 1) == '/') {
                        var file_shortest = list[0].file.split('/');
                        var file_original_length = file_shortest.length;
                        for (var i = 1; i < list.length; i++) {
                            var file = list[i].file.split('/');
                            for (var j = 0; j < file_shortest.length; j++) {
                                if (file_shortest[j] != file[j]) {
                                    file_shortest.splice(j, file_shortest.length - j);
                                    break;
                                }
                            }
                        }
                        if (file_shortest.length > 2) {
                            if (file_shortest.length == file_original_length) {
                                file_shortest.pop();
                            }
                            file_shortest = file_shortest.join('/');
                            for (var i = 0; i < list.length; i++) {
                                list[i].file = '...' + list[i].file.substr(file_shortest.length);
                            }
                        }
                    }
                } catch (e) {}

                return list;
            } catch(e) {
                pack.logger.error(e);
            }
        },

        getFrameLabel: function(frame)
        {
            try {
                if (frame['class']) {
                    if (frame['type'] == 'throw') {
                        return 'throw ' + frame['class'];
                    } else
                    if (frame['type'] == 'trigger') {
                        return 'trigger_error';
                    } else {
                        return frame['class'] + frame['type'] + frame['function'];
                    }
                }
                return frame['function'];
            } catch(e) {
                pack.logger.error(e);
            }
        },

        argIterator: function(frame)
        {
            try {
                if(!frame.args) {
                    return [];
                }
                var items = [];
                for (var i = 0; i < frame.args.length; i++) {
                    items.push({
                        value: frame.args[i],
                        tag: this.getRepForNode(frame.args[i]).shortTag,
                        more: (i < frame.args.length-1)
                    });
                }
                return items;
            } catch(e) {
                pack.logger.error(e);
            }
        }
    }
}};
