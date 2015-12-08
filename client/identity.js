Services = new Meteor.Collection("services", {connection:null});

function addService(service, identity) {
	if(service[0] === "") return;
	Services.upsert(service[0], {id: service[0], address: service[1], public: service[2], identity: identity});
}

Template.identity.helpers({
	services: function(identity) {
		Services.remove({});

		var service = ethid.getServiceIterator(identity.address, 0);
		addService(service, identity);

		while(service[3].toNumber() != 0) {
			service = ethid.getServiceIterator(identity.address, service[3].toNumber());
			addService(service, identity)
		}

		return Services.find({});
	},

	serviceQuery: function(service) {
		return ethid.get(service.identity.address, service.id);
	},

	owning: function(identity) {
		var accounts = eth.accounts;
		for(var i = 0; i < accounts.length; i++) {
			if(accounts[i] == identity.address) return true;
		}
		return false;
	},
});
