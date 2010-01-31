
var PACK = require("pack", "template-pack");


exports.Pack = function() {
    var Pack = function() {};
    Pack.prototype = PACK.Pack(module);
    var self = new Pack();

    self.registerCss("common.css");

    self.registerTemplate("table");
    self.registerTemplate("trace");
    self.registerTemplate("exception");
    
    return self;
}
