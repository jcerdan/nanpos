var printer = require("node-thermal-printer");
var accounting = require("accounting");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0',
  characterSet: 'FRANCE'
});

var cashdrawer = function(){
	
	printer.openCashDrawer();   
	printer.execute();

}

module.exports = cashdrawer;