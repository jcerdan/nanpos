var printer = require("node-thermal-printer");
var accounting = require("accounting");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0',
  characterSet: 'FRANCE'
});

var printClosing = function(closing){
	printer.alignCenter();
	printer.setTextQuadArea();
	printer.println("UNIPUNT 2");
	printer.newLine();
	printer.setTextNormal();
	printer.println("Tancament del dia ");
	printer.bold(true);
	printer.println(closing.data);
	printer.bold(false);
	printer.newLine();

	printer.tableCustom([
	  { text:"Núm.Tick.", align:"CENTER", width:0.20, bold:true },
	  { text:"Desc.", align:"CENTER", width:0.25, bold:true },
	  { text:"Impostos", align:"CENTER", width:0.25, bold:true },
	  { text:"Total", align:"CENTER", width:0.25, bold:true },
	]);
	printer.drawLine();
	printer.tableCustom([
	  { text: closing.numberOfTickets, align:"CENTER", width:0.20 },
	  { text: accounting.formatMoney(closing.discounts, "", 2, ".", ","), align:"CENTER", width:0.25 },
	  { text: accounting.formatMoney(closing.taxes, "", 2, ".", ","), align:"CENTER", width:0.25 },
	  { text: accounting.formatMoney(closing.amount, "", 2, ".", ","), align:"CENTER", width:0.25 },
	]);
	printer.drawLine();
	printer.newLine();

	printer.cut();
	printer.execute();

}

module.exports = printClosing;