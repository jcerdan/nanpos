/*'use strict';*/

Vue.config.debug = true;

var app = new Vue({
	el: "#app",
	data: {
		fieldDataPartial: '',
		dataClosings: '',
		closings: {
			list: [],
		},
		partial: {
			data: '',
			amount: 0,
			disounts: 0,
			taxes: 0,
			numberOfTickets: 0,
		},
		sortKey: 'data',
    reverse: true,
    search: '',
	},
	ready: function () {
		this.dataClosings = moment().format("YYYY-MM");
    this.$http({url: '/api/closings?date=' + this.dataClosings, method: 'GET'}).then(function (response) {
    	this.closings.list = response.data;
    }, function (response) {
    	console.log("error: ", response);
    });
    this.$http({url: '/api/closing?date=' + moment().format("YYYY-MM-DD"), method: 'GET'}).then(function(response){
    	console.log('closing today info', response.data);
    	this.partial = {
    		data: moment().format('YYYY-MM-DD'),
    		amount: response.data.total,
    		discounts: response.data.descomptes,
    		taxes: response.data.impostos,
    		numberOfTickets: response.data.totalTickets,
    	}
    }, function(response){
    	console.log('error', response);
    })
  },
	computed: {
		sum: function(){
	    var pivot = this.closings.list.reduce(function(prev, line){
	      return prev + line.amount;
	    }, 0);
	    return accounting.toFixed(pivot, 2);
	  },
	  discount: function(){
	  	var pivot = this.closings.list.reduce(function(prev, line){
	      return prev + line.discounts;
	    }, 0);
	    return accounting.toFixed(pivot, 2);
	  },
	  tax: function(){
			var pivot = this.closings.list.reduce(function(prev, line){
	      return prev + line.taxes;
	    }, 0);
	    return accounting.toFixed(pivot, 2);
	  },
	},
	methods: {
		sortBy: function(sortKey) {
      this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
      this.sortKey = sortKey;
      console.log(this.sortKey);
      console.log(this.reverse);
  	},
  	changeDate: function(data){
  		this.$http({url: '/api/closing?date=' + this.fieldDataPartial, method: 'GET'}).then(function(response){
	    	this.partial = {
	    		data: this.fieldDataPartial,
	    		amount: response.data.total,
	    		discounts: response.data.descomptes,
	    		taxes: response.data.impostos,
	    		numberOfTickets: response.data.totalTickets,
	    	}
	    }, function(response){
	    	console.log('error', response);
	    });
  	},
  	closeDay: function(){
  		this.$http({
  			url: '/api/closings',
  			method: 'POST',
  			data: JSON.stringify(this.partial)
  		}).then(function(response){
				//console.log(response.data)
				this.partial.idClosings = response.data
  			this.closings.list.push(this.partial);
  			console.log('Closing saved.', response.data);
  		}, function(error){
  			console.log('error', error);
  		});
  	},
  	changeList: function(){
  		this.$http({url: '/api/closings?date=' + this.dataClosings, method: 'GET'}).then(function (response) {
	    	this.closings.list = response.data;
	    }, function (response) {
	    	console.log("error: ", response);
	    });
  	},
  	printClosing: function(idClosings){
  		this.$http({url: '/api/closings/' + idClosings + '/print', method: 'GET'}).then(function (response) {
	    	console.log(response.data);
	    	this.currentClosing = response.data;
	    }, function (response) {
	    	console.log("error: " + response);
	    });
  	},
  	printMonthlyResume: function(){
  		var mes = moment(this.dataClosings);
  		this.$http({
  			url: '/api/closings/monthly/print',
  			method: 'GET',
  			data: {
  				data: mes.format("MMMM YYYY").toUpperCase(),
  				sum: this.sum,
  				discount: this.discount,
  				taxes: this.tax,
  			}
  		}).then(function (response) {
	    	console.log(response.data);
	    	this.currentClosing = response.data;
	    }, function (response) {
	    	console.log("error: " + response);
	    });
  	}
  }
});
