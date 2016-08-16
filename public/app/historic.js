/*'use strict';*/

Vue.config.debug = true;

var app = new Vue({
	el: "#app",
	data: {
		dataTickets: '',
		tickets: {
			list: [],
		},
		sortKey: 'data',
    reverse: false,
    search: '',
    showModal: false,
    currentTicket: {
    	idTicket: '',
    	data: '',
    	importTotal: '',
    	descompteAcumulat: '',
    	impostos: '',
    	lines: []
    }
	},
	ready: function () {
		this.dataTickets = moment().format("YYYY-MM-DD");
    this.$http({url: '/api/ticketsHistory?date=' + this.dataTickets, method: 'GET'}).then(function (response) {
    	console.log(response.data);
    	this.tickets.list = response.data;
    }, function (response) {
    	console.log("error: " + response);
    });
  },
	computed: {
		sum: function(){
	    return this.tickets.list.reduce(function(prev, line){
	      return prev + line.importTotal; 
	    }, 0);
	  },
	  discount: function(){
	  	return this.tickets.list.reduce(function(prev, line){
	      return prev + line.descompteAcumulat; 
	    }, 0);
	  },
	  tax: function(){
			return this.tickets.list.reduce(function(prev, line){
	      return prev + line.impostos; 
	    }, 0);
	  },
	},
	methods: {
		sortBy: function(sortKey) {
      this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
      this.sortKey = sortKey;
      console.log(this.sortKey);
      console.log(this.reverse);
  	},
  	changeDate: function(){
  		console.log(this.dataTickets);
  		this.$http({url: '/api/ticketsHistory?date=' + this.dataTickets, method: 'GET'}).then(function (response) {
	    	console.log(response.data);
	    	this.tickets.list = response.data;
	    	this.search = '';
	    }, function (response) {
	    	console.log("error: " + response);
	    });
  	},
  	showTicket: function(idTickets){
  		this.$http({url: '/api/tickets/' + idTickets, method: 'GET'}).then(function (response) {
	    	console.log(response.data);
	    	this.currentTicket = response.data;
	    	this.showModal = true;
	    }, function (response) {
	    	console.log("error: " + response);
	    });
  	},
  	printTicket: function(idTickets){
  		this.$http({url: '/api/tickets/' + idTickets + '/print', method: 'GET'}).then(function (response) {
	    	console.log(response.data);
	    	idTickets = null;
	    }, function (response) {
	    	console.log("error: " + response);
	    });
  	}
  }
});