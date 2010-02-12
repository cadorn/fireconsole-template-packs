
var PACK = require("pack", "template-pack");


exports.Pack = function() {
    var Pack = function() {};
    Pack.prototype = PACK.Pack(module);
    var self = new Pack();

    self.registerCss("common.css");

    self.registerTemplate("legacy/table");
    self.registerTemplate("legacy/trace");
    self.registerTemplate("legacy/exception");

    return self;
}
