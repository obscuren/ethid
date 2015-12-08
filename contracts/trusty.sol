//0x83697fee3e6c01f445c384597452908c766edc55
contract EthId {
    function setRetSize(uint _s);
    function register(string name);
}

contract Trusty {
    struct Id {
        address[] verifiers;
        bool exist;
    }

    function Trusty() {
        ethid.register("trusty");
    }
    
    function verify(address who) {
        Id id = ids[who];
        id.verifiers.push(msg.sender);
    }
    
    // storage variable is never used. This is only meant for checking unique
    // addresses during `getRating` call which is a constant.
    mapping(address => bool) uniqAddresses;
    function getRating(address who, uint depth) constant returns(uint rating) {
        if(depth == 0) return 0;
        
        Id id = ids[who];
        
        for(var i = 0; i < id.verifiers.length; i++) {
            address addr = id.verifiers[i];
            if(uniqAddresses[addr]) continue;
            uniqAddresses[addr] = true;
            
            rating += this.getRating(addr, depth - 1);
            rating++;
        }
        
        return;
    }
    
    function retType() constant returns(ReturnType) {
        return ReturnType.Int;
    }
    function queryInt(address addr) constant returns(uint) {
        return getRating(addr, 5);
    }
    
    EthId ethid = EthId(0xd210b2ba37b8f872fb1a7ef306aa21c98fdcd0f3);
    mapping(address => Id) ids;
    enum ReturnType { Int, Bool, Bytes }    
}

