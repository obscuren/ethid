contract ServiceContract {
    function query() public returns(string);
}

contract EthId {
    struct Identity {
        string name;
        uint256 expire;
        mapping(address => Service) services;
        
        bool exist;
    }
    
    // 1 identity per address which allows us to do reverse lookups
    mapping(address => Identity) ids;
    mapping(bytes32 => address) reverse;
    
    event NewIdentity(address indexed owner);
    event ChangeIdentity(address indexed owner, bytes32 old, bytes32 _new);
    event RemoveIdentity(address indexed owner);
    
    function EthId() {}
    
    function register(string name) {
        // already ownining an identity. Use change!
        if(ids[msg.sender].exist) throw;
        bytes32 id = sha3(name);
        // already registered identity. Use different id!
        if(reverse[id] != 0x0) throw;
        
        // congrats on your ethereum citizenship
        Identity memory identity;
        identity.name = name;
        identity.expire = now + 1 years;
        identity.exist = true;
        ids[msg.sender] = identity;
        
        reverse[id] = msg.sender;
        
        NewIdentity(msg.sender);
    }
    
    function identify(address who) constant returns(string) { return ids[who].name; }
    function lookup(string name) constant returns(address) { return reverse[sha3(name)]; }
    
    function renew() {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        if(reverse[sha3(identity.name)] != msg.sender) throw;
        
        // Can only renew 10 days prior to expiring.
        if(identity.expire - now != 10 days) return;
        
        identity.expire += 1 years;
    }
    
    function rename(string _new) {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 oldId = sha3(identity.name);
        if(reverse[oldId] != msg.sender) throw;
        
        bytes32 id = sha3(_new);
        if(reverse[id] != 0x0) return;
        
        ids[msg.sender].name = _new;
        reverse[id] = msg.sender;
        
        delete reverse[oldId];
    }
    
    function unregister() {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
        
        delete reverse[id];
        delete ids[msg.sender];
        
        RemoveIdentity(msg.sender);
    }
    
    struct Service {
        bool pub;
        bool exist;
    }
    
    function query(address addr) constant returns(string) {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
        
        Service service = identity.services[addr];
        if(!service.exist) throw;
        
        if(service.pub) {
            ServiceContract sc = ServiceContract(addr);
            return sc.query(); // ERROR!
        } else {
            // TODO
        }
    }
    
    function addService(address addr, bool pub) {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
        
        Service service = identity.services[addr];
        if(service.exist) throw;
        
        service.pub = pub;
        service.exist = true;
    }
    
    function removeService(address addr) {
         Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
 
        delete identity.services[addr];      
    }
    
    function() { throw; }
}
