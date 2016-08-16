<template>
	<h1>Tickets</h1>
	<div class="row">

	  <div class="col-md-9">
	  
	    <div class="col-md-4">
	      <div class="panel panel-primary">
	        <div class="panel-heading">
	          Concurs Solista - €80
	        </div>
	        <div class="panel-body">
	          <p class="text-justify">
	            Inscripció al concurs de solistes.<br/><br/>
	          </p>
	          <button id="solista" value="Solista" v-on="click: add('concursSolista')">
	            Afegir a la cistella
	          </button>
	        </div>
	      </div>
	    </div>

	    <div class="col-md-4">
	      <div class="panel panel-primary">
	        <div class="panel-heading">
	          Concurs Quartet - €120
	        </div>
	        <div class="panel-body">
	          <p class="text-justify">
	            Inscripció al concurs de Quartets.<br/><br/>
	            Amb aquest producte podreu participar 4 saxofonistes al concurs. Només l'heu d'adquirir una vegada per quartet.<br/><br/>
	          </p>
	          <button id="quartet" value="Quartet" v-on="click: add('concursQuartet')">
	            Afegir a la cistella
	          </button>
	        </div>
	      </div>
	    </div>

	    <div class="col-md-4">
	      <div class="panel panel-primary">
	        <div class="panel-heading">
	          Concurs Bandas - €150
	        </div>
	        <div class="panel-body">
	          <p class="text-justify">
	            Inscripció al concurs de Bandes.<br/><br/>
	            Amb aquest producte podreu participar amb la vostra banda al concurs. Només l'heu d'adquirir una vegada per banda.<br/><br/>
	          </p>
	          <button id="banda" value="Bandas" v-on="click: add('concursBanda')">
	            Afegir a la cistella
	          </button>
	        </div>
	      </div>
	    </div>
	  </div>

	  <div class="col-md-3">
	    <div class="panel panel-danger">
	      <div class="panel-heading">
	        Cart
	      </div>
	      <div class="panel-body">
	        <table class="table table-striped table-condensed">
	          <thead>
	            <tr>
	              <th colspan="3">Detall de la cistella</th>
	            </tr>
	          </thead>
	          <tr v-repeat="item: cart">
	            <td><i class="fa fa-times" v-on="click: delete(item)"></i></td>
	            <td>{{ item.title }}</td>
	            <td>{{ item.price | currency '€'}}</td>
	          </tr>
	        </table>
	        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#confirmationModal">Checkout</button>  
	      </div>
	    </div>
	  </div>
	</div>        

	<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="myConfirmationModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">Confirmation</h4>
	      </div>
	      <div class="modal-body">
	        <p>Check info and fill the following form to continue&hellip;</p>
	        <table class="table">
	          <thead>
	            <tr>
	              <th></th>
	              <th>preu</th>
	            </tr>
	          </thead>
	          <tr v-repeat="item: cart">
	            <td>{{ item.title }}</td>
	            <td>{{ item.price | currency '€'}}</td>
	          </tr>
	        </table>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-primary">Pay</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div>
</template>

<script>
export default {
  data: function(){
		return {
			productes:{
				concursSolista:{
					preu: 80.00,
					quantitatMaxima: 50
				},
				concursQuartet:{
					preu: 120.00,
					quantitatMaxima: 20
				},
				concursBanda:{
					preu: 150.00,
					quantitatMaxima: 10
				},
			},
			concursSolista: 0,
			concursQuartet: 0,
			concursBanda: 0,
			cart: []
		}
	},
	methods:{
		add: function(item){
			switch(item){
				case "concursSolista":
					if (this.concursSolista != 1){
						this.concursSolista = 1;
						this.cart.push({
							type : "concursSolista",
							title: "Concurs Solista",
							price: this.productes.concursSolista.preu
						});
					}
					break;
				case "concursQuartet":
					if (this.concursQuartet != 1){
						this.concursQuartet = 1;
						this.cart.push({
							type : "concursQuartet",
							title: "Concurs Quartet",
							price: this.productes.concursQuartet.preu
						});
					}
					break;
				case "concursBanda":
					if (this.concursBanda != 1){
						this.concursBanda = 1;
						this.cart.push({
							type : "concursBanda",
							title: "Concurs Banda",
							price: this.productes.concursBanda.preu
						});
					}
					break;
			}
		},
		delete: function(item){
			switch(item.type){
				case "concursSolista": 
					this.concursSolista = 0;
					break;
				case "concursQuartet": 
					this.concursQuartet = 0;
					break;
				case "concursBanda": 
					this.concursBanda = 0;
					break;
			}
			this.cart.$remove(item);
		}
	}
}
</script>

<style>
.red {
  color: #f00;
}
</style>