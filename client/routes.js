FlowRouter.route("/", {
	name:"list",
	action: function(params) {
		BlazeLayout.render("main", {main: "list"});
	},

});

FlowRouter.route("/:name", {
	name: "identity",
	action: function(params) {
		var identity = Identities.findOne({name: params.name});
		console.log(identity);
		BlazeLayout.render("main", {main: "identity", data: {identity: identity}})
	},
});
