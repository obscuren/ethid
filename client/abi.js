var ethidContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"renew","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"typ","type":"string"},{"name":"addr","type":"address"},{"name":"pub","type":"bool"}],"name":"setService","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"numIdentities","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"},{"name":"typ","type":"string"}],"name":"query","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"identify","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"string"}],"name":"rename","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"typ","type":"string"}],"name":"unsetService","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_s","type":"uint256"}],"name":"setRetSize","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"idx","type":"uint256"}],"name":"getIterator","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"n","type":"bytes32"}],"name":"getService","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"unregister","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"register","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"lookup","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"NewIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"old","type":"string"},{"indexed":false,"name":"_new","type":"string"}],"name":"ChangeIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"RemoveIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"service","type":"address"}],"name":"SetService","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"service","type":"address"}],"name":"UnsetService","type":"event"}]);
ethid = ethidContract.at("0x3cd41c70aa797b984ec670955116c5edaa29049d");
//ethid = ethidContract.at("0xa70115177267227a9e78c26dc77a074ba57dad87");

var accounts = eth.accounts;
for(var i = 0; i < accounts.length; i++) {
	ethid.NewIdentity({owner: accounts[i]}, function(error, res) {
		var name = ethid.identify(res.args.owner);

		Identities.upsert(res.args.owner, {address: res.args.owner, name: name, verified: true});
		GlobalNotification.info({
			content: name + " successfully registered", 
			duration: 5,
		});
	});

	ethid.RemoveIdentity({owner: accounts[i]}, function(error, res) {
		var name = ethid.identify(res.args.owner);

		Identities.remove({address: res.args.owner});
		GlobalNotification.info({
			content: name + " successfully unregistered", 
			duration: 5,
		});
	});

	ethid.ChangeIdentity({owner: accounts[i]}, function(error, res) {
		var name = ethid.identify(res.args.owner);

		Identities.upsert(res.args.owner, {address: res.args.owner, name: name, verified: true});
		GlobalNotification.info({
			content: name + " successfully changed", 
			duration: 5,
		});
	});
}
