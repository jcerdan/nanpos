var printer = require("node-thermal-printer");
var accounting = require("accounting");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0',
  characterSet: 'FRANCE'
});

var printClosingMonthlyReceipt = function(monthlyClosing){
	printer.alignCenter();
	printer.setTextQuadArea();
	printer.println("UNIPUNT 2");
	printer.newLine();
	printer.setTextNormal();
	printer.println("Tancament del mes ");
	printer.bold(true);
	printer.println(monthlyClosing.data);
	printer.bold(false);
	printer.newLine();

	printer.tableCustom([
	  { text:"Desc.", align:"CENTER", width:0.30, bold:true },
	  { text:"Impostos", align:"CENTER", width:0.30, bold:true },
	  { text:"Total", align:"CENTER", width:0.35, bold:true },
	]);
	printer.drawLine();
	printer.tableCustom([
	  { text: accounting.formatMoney(monthlyClosing.discounts, "", 2, ".", ","), align:"CENTER", width:0.30 },
	  { text: accounting.formatMoney(monthlyClosing.taxes, "", 2, ".", ","), align:"CENTER", width:0.30 },
	  { text: accounting.formatMoney(monthlyClosing.amount, "", 2, ".", ","), align:"CENTER", width:0.35 },
	]);
	printer.drawLine();
	printer.newLine();

	printer.cut();
	printer.execute();

}

module.exports = printClosingMonthlyReceipt;