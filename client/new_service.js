Template.new_service.events({
	"submit .new-service": function(event) {
		event.preventDefault();

		var target = event.currentTarget;

		ethid.setService(target.id.value, target.address.value, true, {from: target.owner.value, gas: 200000});
		GlobalNotification.info({
			content: "Setting '"+target.id.value+"' to '"+target.address.value,
			duration: 5,
		});
	},
})
