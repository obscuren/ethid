Identities = new Mongo.Collection("identities", {connection:null});
new PersistentMinimongo(Identities, "ethereum_ethid-dapp");

