var ethidContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"renew","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"},{"name":"typ","type":"string"}],"name":"getQueryReturnType","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"typ","type":"string"},{"name":"addr","type":"address"},{"name":"pub","type":"bool"}],"name":"setService","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"idx","type":"uint256"}],"name":"getServiceIterator","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"numIdentities","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"},{"name":"typ","type":"string"}],"name":"query","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"identify","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"},{"name":"typ","type":"string"}],"name":"queryInt","outputs":[{"name":"r","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"string"}],"name":"rename","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"typ","type":"string"}],"name":"unsetService","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_s","type":"uint256"}],"name":"setRetSize","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"n","type":"bytes32"}],"name":"getService","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"unregister","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"register","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"lookup","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"NewIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"ChangeIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"RemoveIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"service","type":"address"}],"name":"SetService","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"id","type":"bytes32"},{"indexed":false,"name":"service","type":"address"}],"name":"UnsetService","type":"event"}]);

ethid = ethidContract.at("0xbb07c075495fd9d0840c95da2ef983adb341f54d");
ethid.get = function(address, type) {
	switch(this.getQueryReturnType(address, type).toNumber()) {
		case 0: // int
			return this.queryInt(address, type);
		case 2: // bytes
			return web3.toUtf8(this.query(address, type));
	}
};
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
