FlowRouter.route("/", {
	name:"list",
	action: function(params) {
		BlazeLayout.render("main", {main: "list"});
	},

});

FlowRouter.route("/:name", {
	name: "identity",
	action: function(params) {
		var identity = {name: params.name, address: ethid.lookup(params.name)};

		ethid.SetService({owner: identity.address}, function(error, res) {
			var service = ethid.getService(identity.address, res.args.id);
			Services.upsert(service[0], {id: service[0], address: service[1], public: service[2]});
		});

		ethid.UnsetService({owner: identity.address}, function(error, res) {
			var service = ethid.getService(identity.address, res.args.id);
			Services.remove({id: service[0]});
		});

		BlazeLayout.render("main", {main: "identity", data: {identity: identity}})
	},
});
