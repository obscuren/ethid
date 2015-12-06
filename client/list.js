Template.list.helpers({
	identities: function() {
		return Identities.find({});
	},
	isVerified: function(verified) {
		return verified ? "" : "pending";
	},
});


Template.list.events({
	"click .identity": function(event) {
		FlowRouter.go("identity", {name: $(event.currentTarget).data("name")});
	},
});
