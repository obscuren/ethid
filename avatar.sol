contract EthId {
    function setRetSize(uint _s);
}

// avatar EthId subservice
contract Avatar {
    mapping(address => string) avatars;
    function set(string url) {
        avatars[msg.sender] = url;
    }
    
    function query(address addr) returns(byte[255] r) {
        //string memory test = "http://www.gravatar.com/avatar/85509aa7abacfc7f94e4799e2efd7e92";
        
        bytes memory b = bytes(avatars[addr]);
        EthId(msg.sender).setRetSize(b.length); // call size callback
        for(var i = 0; i < b.length; i++) {
            r[i] = b[i];
        }
        return r;
    }
}
