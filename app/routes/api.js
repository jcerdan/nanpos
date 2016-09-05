const Categories = require('../models/categories');
const config     = require('../../config');
const database   = require('../../database.js');
const moment     = require('moment');
const ticketReceipt = require('../printings/printer.js');
const closingReceipt = require('../printings/closings.js');
const closingMonthlyReceipt = require('../printings/closings-monthly.js');

module.exports = function(app, express) {

  const apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
    res.json({ message: 'API access OK' });
  });


  /********* Categories **********/

  apiRouter.route('/categories').get(function(req, res){
    database.query("SELECT * FROM Categories WHERE parentID=0", function(err, rows, fields){
      if (err){
        console.log(err);
      }
      else{
        //console.log(rows);
        res.json(rows);
      }
    });
	});

  apiRouter.route('/categories/:parentID').get(function(req, res){
		database.query("SELECT * FROM Categories WHERE parentID = ?", req.params.parentID, function(err, rows, fields){
      if (err){
        console.log(err);
      }
      else{
        //console.log(rows);
        res.json(rows);
      }
    });
	});

  /******** Cash Drawer ***********/

  apiRouter.route('/cashdrawer').get(function(req,res){
    cashdrawer()
  });


  /******** Tickets ***********/

  apiRouter.route('/tickets/last').get(function(req, res){
    database.query("SELECT LAST_INSERT_ID() as ticketID", function(err, rows, fields){
      if (err){
        console.log(err);
      }
      else{
        //console.log("last insert ID", rows[0].ticketID);
        res.json(rows[0]);
      }
    });
  });

  apiRouter.route('/tickets/:idTickets').get(function(req, res){
    database.query("SELECT * FROM Tickets WHERE idTickets = ?", req.params.idTickets, function(err, rows, fields){
      if (err){
        console.log(err);
      }
      else{
        let ticket = rows[0];
        ticket.data = moment(ticket.data).format("YYYY-MM-DD HH:mm:ss");
        database.query("SELECT * FROM TicketLines WHERE Tickets_idTickets = ?", ticket.idTickets, function(err, rows, fields){
          ticket.lines = rows;
          res.json(ticket);
        });
      }
    });
  });

  apiRouter.route('/tickets/:idTickets/print').get(function(req, res){
    database.query("SELECT * FROM Tickets WHERE idTickets = ?", req.params.idTickets, function(err, rows, fields){
      if (err){
        console.log(err);
      }
      else{
        let ticket = rows[0];
        ticket.data = moment(ticket.data).format("YYYY-MM-DD HH:mm:ss");
        database.query("SELECT * FROM TicketLines WHERE Tickets_idTickets = ?", ticket.idTickets, function(err, rows, fields){
          ticket.lines = rows;
          ticketReceipt(ticket);
          res.json({
            ok: true,
          });
        });
      }
    });
  });

  apiRouter.route('/tickets').post(function(req,res){
    let ticketID = 0
    console.log("ticketID: ", ticketID)
    let ticket = {
      data: moment().format("YYYY-MM-DD HH:mm:ss"),
      importTotal: req.body.totalTicket,
      descompteAcumulat: req.body.descompteAcumulat,
      impostos: req.body.IGI
    }
    database.query('INSERT INTO Tickets SET ?', ticket, function(error1, results){
      if(error1) {
        console.log('error 1: ', error1);
      }
      else{
        console.log("result insert ticket: ", results)
        ticketID = results.insertId;
        console.log("ticketID: ", ticketID)
        console.log("ticket ID inserted", ticketID)
        let lines = req.body.lines;
        let arrayInsert = []
        lines.forEach(function(element, index) {
          let ticketLine = [ticketID, element.amount, element.quantity, element.discountAmount, element.discountPercentage, element.net, element.category.trim()]
          arrayInsert.push(ticketLine)
        })
        console.log("Array to insert: ", arrayInsert)
        database.query('INSERT INTO TicketLines (Tickets_idTickets, amount, quantity, discountAmount, discountPercentage, net, detail) VALUES ?', [arrayInsert], function(error2, results2){
          if (error2)
            console.log('error 2: ', error2);
          else{
            console.log("result insert ticketline: ", results2)
            console.log("insert ticketline ID: ", results2.insertId)
            res.json({
              result: ticketID
            });
          }
        });
      }
    });
  });

  /*************  TICKETS HISTORY ***************/

  apiRouter.route('/ticketsHistory').get(function(req, res){
    console.log('request params', req.query.date);
    database.query('SELECT idTickets, DATE_FORMAT(data, "%H:%i:%s") as data, importTotal, descompteAcumulat, impostos FROM Tickets WHERE data LIKE ?', [req.query.date+'%'], function(error, rows, fields){
      if (error)
        throw error;
      console.log("tickets", rows);
      res.json(rows);
    });
  });

  /************* TANCAMENTS *********************/
  apiRouter.route('/closing').get(function(req, res){
    console.log('request params', req.query.date);
    database.query('SELECT SUM(importTotal) as total, SUM(descompteAcumulat) as descomptes, SUM(impostos) as impostos, COUNT(*) as totalTickets FROM Tickets WHERE data LIKE ?', [req.query.date+'%'], function(error, rows, fields){
      if (error)
        throw error;
      console.log("closingToday", rows[0]);
      res.json(rows[0]);
    });
  });

  apiRouter.route('/closings').get(function(req, res){
    console.log('request params', req.query.date);
    database.query('SELECT idClosings, DATE_FORMAT(data, "%Y-%m-%d") as data, amount, discounts, taxes, numberOfTickets FROM Closings WHERE data LIKE ? ORDER BY data DESC', [req.query.date+'%'], function(error, rows, fields){
      if (error)
        throw error;
      console.log("closings", rows);
      res.json(rows);
    });
  });

  apiRouter.route('/closings/monthly/print').get(function(req, res){
    let tancamentMensual = {
      data: req.query.data,
      amount: req.query.sum,
      discounts: req.query.discount,
      taxes: req.query.taxes,
    }
    closingMonthlyReceipt(tancamentMensual);
    res.json({
      ok: true,
    });
  });

  apiRouter.route('/closings/:idClosings').get(function(req, res){
    console.log('request params', req.params.idClosings);
    database.query('SELECT idClosings, DATE_FORMAT(data, "%Y-%m-%d") as data, amount, discounts, taxes, numberOfTickets FROM Closings WHERE idClosings = ?', [req.params.idClosings], function(error, rows, fields){
      if (error)
        throw error;
      console.log("closing", rows[0]);
      res.json(rows[0]);
    });
  });

  apiRouter.route('/closings/:idClosings/print').get(function(req, res){
    console.log('request params', req.params.idClosings);
    database.query('SELECT idClosings, DATE_FORMAT(data, "%Y-%m-%d") as data, amount, discounts, taxes, numberOfTickets FROM Closings WHERE idClosings = ?', [req.params.idClosings], function(error, rows, fields){
      if (error)
        throw error;
      console.log("closing", rows[0]);
      closingReceipt(rows[0]);
      res.json({
        ok: true,
      });
    });
  });

  apiRouter.route('/closings').post(function(req,res){
    let closing = {
      data: req.body.data,
      amount: req.body.amount,
      discounts: req.body.discounts,
      taxes: req.body.taxes,
      numberOfTickets: req.body.numberOfTickets
    }
    database.query('DELETE FROM Closings WHERE data LIKE ?', [req.body.data], function(error, results){
      if (error)
        throw error;
      else{
        database.query('INSERT INTO Closings SET ?', closing, function(error, results){
          if (error)
            throw error;
          else{
            res.json(results);
          }
        });
      }
    });
    console.log('closing to save', closing);
  });

  return apiRouter;

};