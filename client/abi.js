var ethidContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"renew","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"addService","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"identify","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"string"}],"name":"rename","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"removeService","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"unregister","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"register","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"lookup","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"NewIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"old","type":"bytes32"},{"indexed":false,"name":"_new","type":"bytes32"}],"name":"ChangeIdentity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"RemoveIdentity","type":"event"}]);
ethid = ethidContract.at("0xfefeae2131b3af93461cbe8633cdabbfd47f474f");
