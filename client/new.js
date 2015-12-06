var zeroAddress = "0x0000000000000000000000000000000000000000";

Template.new_identity.helpers({
	accounts: function() {
		var accounts = [];
		eth.accounts.forEach(function(account) {
			var name = ethid.identify(account);
			if(name.length === 0) {
				accounts.push(account);
			}
		});
		return accounts;
	},
});

Template.new_identity.events({
	'submit .new-identity': function(event) {
		event.preventDefault();

		var target = event.currentTarget;
		if(ethid.lookup(target.name.value) !== zeroAddress) {
			GlobalNotification.error({
				content: target.name.value + " is already registered", 
				duration: 5,
			});
			return;
		}

		try {
			ethid.register(target.name.value, {from:target.account.value, gas:200000});
			GlobalNotification.info({
				content: "Registering: " + target.name.value,
				duration: 5,
			});
			Identities.upsert(target.account.value, {address: target.account.value, name: target.name.value, verified: false});
		} catch(e) {
			GlobalNotification.error({
				content: "" + e, 
				duration: 5,
			});
		}
	},
});
