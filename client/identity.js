Template.identity.helpers({
	services: function(identity) {
		var services = [];

		var service;
		do {
			service = ethid.getService(identity.address, 0);
			services.push({id: service[0], address: service[1], public: service[2]});
		} while(service[3] != 0)

		return services;
	},

	owning: function(identity) {
		var accounts = eth.accounts;
		for(var i = 0; i < accounts.length; i++) {
			if(accounts[i] == identity.address) return true;
		}
		return false;
	},
});
