var printer = require("node-thermal-printer");
var accounting = require("accounting");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0',
  characterSet: 'FRANCE'
});

var printTicket = function(ticket){
	printer.alignCenter();
	printer.setTextQuadArea();
	printer.println("UNIPUNT 2");
	printer.setTextNormal();
	printer.println("Avda. Sant Antoni, 19");
	printer.println("AD400 La Massana");
	printer.println("Andorra");
	printer.println("NRT: L-459876-N");
	printer.newLine();
	printer.println(ticket.data);
	printer.newLine();

	printer.tableCustom([
	  { text:"UN.", align:"CENTER", width:0.10, bold:true },
	  { text:"Descripció", align:"LEFT", width:0.50, bold:true },
	  { text:"Preu", align:"RIGHT", width:0.20, bold:true },
	  { text:"Import", align:"RIGHT", width:0.20, bold:true },
	]);
	printer.drawLine();
	// accounting.formatMoney(4999.99, "€", 2, ".", ",");

	ticket.lines.forEach( function(element, index) {
		printer.tableCustom([
		  { text: element.quantity, align:"CENTER", width:0.10 },
		  { text: element.detail, align:"LEFT", width:0.50 },
		  { text: accounting.formatMoney(element.amount, "", 2, ".", ","), align:"RIGHT", width:0.20 },
		  { text: accounting.formatMoney(element.net, "", 2, ".", ","), align:"RIGHT", width:0.20 },
		]);
		printer.newLine();
		if(element.discountAmount != 0){
			printer.setTypeFontB();
			printer.tableCustom([
			  { text:" ", align:"CENTER", width:0.10 },
			  { text:"   Descompte", align:"LEFT", width:0.30 },
			  { text: "-" + accounting.formatMoney(element.discountPercentage, "%", 2, ".", ","), align:"RIGHT", width:0.20 },
			  { text: "-" + accounting.formatMoney(element.discountAmount, "", 2, ".", ","), align:"RIGHT", width:0.20 },
			]);
			printer.setTypeFontA();
			printer.newLine();
		}
	});
	printer.drawLine();
	printer.newLine();

	printer.alignRight();
	printer.println("Descompte Acumulat: " + accounting.formatMoney(ticket.descompteAcumulat,  { symbol: "EUR",  format: "%v %s" }, 2, ".", ","));
	printer.println("IGI inclòs: " + accounting.formatMoney(ticket.impostos, { symbol: "EUR",  format: "%v %s" }, 2, ".", ","));
	printer.newLine();

	printer.setTextDoubleHeight();
	printer.setTextDoubleWidth();
	printer.println("Total: " + accounting.formatMoney(ticket.importTotal, { symbol: "EUR",  format: "%v %s" }, 2, ".", ","));
	printer.newLine();

	printer.alignCenter();
	printer.setTextNormal();
	printer.println("Gràcies per la seva visita.");

	printer.cut();
	printer.execute();

}

module.exports = printTicket;