/*'use strict';*/

Vue.config.debug = true;

var app = new Vue({
	el: "#app",
	data: {
		currentLine:{
			category: '',
			amount: '',
			quantity: 1,
			discountAmount: '',
			discountPercentage: '',
			fieldFocus: "currentAmount",
		},
		ticketLines: [],
		numberOfLines: 0,
		descompteAcumulat: 0,
		categories:{
			level: 0,
			path: [],
			list: []
		},
		showModal: false,
		ticketModal: {
			data: '',
			import: '',
			descompteAcumulat: '',
			IGI: '',
			lines: []
		}
	},
	ready: function () {
    this.$http({url: '/api/categories', method: 'GET'}).then(function (response) {
    	console.log(response.data);
    	this.categories.list = response.data;
    }, function (response) {
    	console.log("error: " + response);
    });
  },
	computed: {
		path: function(){
			var fullpath = '';
			this.categories.path.forEach( function(element, index) {
				fullpath = fullpath + " / " + element.name;
			});
			return fullpath;
		},
		net: function(){
			return accounting.toFixed(((this.currentLine.amount * this.currentLine.quantity) - this.currentLine.discountAmount), 2);
		},
		descompteAcumulat: function(){
			descompte = 0;
			this.ticketLines.forEach(function(element, index) {
				descompte = +descompte + +element.discountAmount;
			});
			return descompte;
		},
		totalTicket: function(){
			total = 0;
			this.ticketLines.forEach(function(element, index) {
				total = +total + +accounting.toFixed(((element.amount * element.quantity) - element.discountAmount), 2);
			});
			return total;
		},
		IGI: function(){
			return accounting.toFixed((this.totalTicket * 4.5 / 100), 2);
		},
	},
	methods:{
		addNumber: function(numberToAdd, focus){
			switch (this.currentLine.fieldFocus) {
				case "amountDiscount":
					this.currentLine.discountAmount = this.currentLine.discountAmount + numberToAdd;
					if (this.currentLine.amount > 0){
						this.currentLine.discountPercentage = '' + accounting.toFixed((this.currentLine.discountAmount * 100) / (this.currentLine.amount * this.currentLine.quantity), 2);
					}
					break;
				case "percentageDiscount":
					this.currentLine.discountPercentage = this.currentLine.discountPercentage + numberToAdd;
						if (this.currentLine.amount > 0){
							this.currentLine.discountAmount = '' + String(((this.currentLine.amount * this.currentLine.quantity) * this.currentLine.discountPercentage / 100));
						}
					break;
				case "currentAmount":
					this.currentLine.amount = "" + this.currentLine.amount + numberToAdd;
					break;
			}
		},
		negative: function(){
			this.currentLine.amount = -Math.abs(this.currentLine.amount);
		},
		emptyDiscounts: function(){
			this.currentLine.discountPercentage = '';
			this.currentLine.discountAmount = '';
		},
		emtpyCurrentLine: function(){
			this.currentLine = {
				category: "",
				amount: "",
				quantity: 1,
				discountAmount: "",
				discountPercentage: "",
				fieldFocus: "currentAmount",
			}
		},
		emptyCurrentTicket: function(){
			this.emtpyCurrentLine();
			this.ticketLines = [];
			this.numberOfLines = 0;
			this.descompteAcumulat = 0;
			this.showModal = false,
			this.ticketModal = {
				data: '',
				import: '',
				descompteAcumulat: '',
				IGI: '',
				lines: []
			}
		},
		addTicketLine: function(category){
			if (this.net!=0){
				this.currentLine.category = this.path + " / " + category;
				this.currentLine.net = this.net;
				this.ticketLines.$set(this.numberOfLines, this.currentLine);
				this.numberOfLines = this.numberOfLines + 1;
				this.emtpyCurrentLine();
				this.$http({url: '/api/categories', method: 'GET'}).then(function (response) {
		    	console.log(response.data);
		    	this.categories.list = response.data;
		    }, function (response) {
		    	console.log("error: " + response);
		    });
		    this.categories.level = 0;
		    this.categories.path = [];
		  }
		},
		delTicketLine: function(line){
			this.ticketLines.$remove(line);
			this.numberOfLines = this.numberOfLines - 1;
		},
		forwardCategory: function(category){
			this.$http({url: '/api/categories/' + category.idCategories, method: 'GET'}).then(function (response) {
	    	this.categories.list = response.data;
	    	this.categories.path.$set(this.categories.level, category);
	    	this.categories.level += 1;
	    }, function (error) {
	    	console.log("error: " + error);
	    });
		},
		backwardCategory: function(){
			var category = this.categories.path[this.categories.level-1];
			this.categories.path.$remove(category);
			this.categories.level -= 1;
			if (this.categories.level > 0){
				var category = this.categories.path[this.categories.level-1];
				this.$http({url: '/api/categories/' + category.idCategories, method: 'GET'}).then(function (response) {
		    	this.categories.list = response.data;
		    }, function (response) {
		    	console.log("error: " + response);
		    });
			}
			else{
				this.$http({url: '/api/categories', method: 'GET'}).then(function (response) {
		    	console.log(response.data);
		    	this.categories.list = response.data;
		    }, function (error) {
		    	console.log("error: " + error);
		    });
			}
		},
		saveAndPrintTicket: function(){
			var ticket = {
				totalTicket: this.totalTicket,
				descompteAcumulat: this.descompteAcumulat,
				IGI: this.IGI,
				lines: this.ticketLines
			}
			this.$http({
				url: '/api/tickets', 
				method: 'POST', 
				data: JSON.stringify(ticket) 
			}).then(function (response) {
				console.log("response:", response)
				this.$http({url: '/api/tickets/last', method: 'GET'}).then(function (response) {
		    	console.log(response.data.ticketID);
		    	this.$http({url: '/api/tickets/' + response.data.ticketID, method: 'GET'}).then(function (response) {
			    	console.log(response.data);
			    	this.ticketModal = response.data;
			    	var ticket = response.data;
			    	this.showModal = true
			    	//this.emptyCurrentTicket()
			    }, function (error) {
			    	console.log("error: " + error);
			    });
		    	this.showModal = true;
		    }, function (error) {
		    	console.log("error: " + error);
		    });
	    	// this.showModal = true;
	    }, function (error) {
	    	console.log("error: " + error);
	    });
		},
		printTicket: function(idTickets){
			console.log(idTickets);
			this.$http({url: '/api/tickets/' + idTickets + '/print', method: 'GET'}).then(function (response) {
				console.log("Sent to printer");
			});
			this.emptyCurrentTicket();
		},
		/*  TODO
		modTicketLine: function(line){
			this.currentLine = {
				amount: line.amount,
				quantity: line.quantity,
				discountAmount: line.discountAmount,
				discountPercentage: line.discountPercentage,
				fieldFocus: "currentAmount",
			}
			this.ticketLines.$remove(line);
			this.numberOfLines = this.numberOfLines - 1;
		}
		*/
	}
});