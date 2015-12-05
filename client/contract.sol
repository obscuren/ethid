contract ServiceContract {
    function query(address addr) public returns(byte[255]);
}

contract EthId {
    struct Identity {
        string name;
        uint256 expire;
        mapping(bytes32 => Service) services;
        
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
    
    // Warning: This is part of the callback mechanism used for service
    // contracts.
    uint _size; // This variable isn't even used to store data.
    bytes _ret; // This variable isn't actually ever used for storing data
    // this variable is only used to so that we may have variable return
    // values.
    struct Service {
	address addr;
        bool pub;
        bool exist;
    }
    function query(address who, string typ) constant returns(bytes) {
        Identity identity = ids[who];
        if(!identity.exist) throw;
        
	bytes32 n = sha3(typ);
        Service service = identity.services[n];
        if(!service.exist) throw;
        
        if(service.pub) {
            ServiceContract sc = ServiceContract(service.addr);
            byte[255] memory q = sc.query(msg.sender);
            // if the service contract set the length we're good to go
            for(var i = 0; i < _size; i++) {
                _ret[_ret.length++] = q[i];
            }
            return _ret;
        } else {
            // TODO.
        }
    }
    function setRetSize(uint _s) {
        _size = _s;
    }
    
    function setService(string typ, address addr, bool pub) {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
        
	bytes32 n = sha3(typ);
        Service service = identity.services[n];
        if(service.exist) throw; // eventually we'll let it overwrite
        
	service.addr = addr;
        service.pub = pub;
        service.exist = true;
    }
    
    function unsetService(string typ) {
        Identity identity = ids[msg.sender];
        if(!identity.exist) throw;
        
        bytes32 id = sha3(identity.name);
        if(reverse[id] != msg.sender) throw;
 
        delete identity.services[sha3(typ)];
    }
    
    function() { throw; }
}

