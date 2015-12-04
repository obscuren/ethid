Template.list.helpers({
	identities: function() {
		return Identities.find({});
	},
	isVerified: function(verified) {
		return verified ? "" : "pending";
	},
});
