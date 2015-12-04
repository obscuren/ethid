FlowRouter.route("/", {
	name:"list",
	action: function(params) {
		BlazeLayout.render("main", {main: "list"});
	},
});

