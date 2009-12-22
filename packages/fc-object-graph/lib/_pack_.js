
var PACK = require("pack", "template-pack");


exports.Pack = function() {
    var Pack = function() {};
    Pack.prototype = PACK.Pack(module);
    var self = new Pack();

    self.registerCss("common.css");

    self.registerTemplate("text");
    self.registerTemplate("constant");
    self.registerTemplate("array");
    self.registerTemplate("map");
    self.registerTemplate("reference");
    self.registerTemplate("dictionary");
    
    return self;
}
