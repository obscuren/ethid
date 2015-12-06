Services = new Meteor.Collection("services", {connection:null});

function addService(service) {
	if(service[0] === "") return;
	Services.upsert(service[0], {id: service[0], address: service[1], public: service[2]});
}

Template.identity.helpers({
	services: function(identity) {
		Services.remove({});

		var service = ethid.getIterator(identity.address, 0);
		addService(service);

		while(service[3].toNumber() != 0) {
			service = ethid.getIterator(identity.address, service[3].toNumber());
			addService(service)
		}

		return Services.find({});
	},

	owning: function(identity) {
		var accounts = eth.accounts;
		for(var i = 0; i < accounts.length; i++) {
			if(accounts[i] == identity.address) return true;
		}
		return false;
	},
});
