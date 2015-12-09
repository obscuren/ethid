contract Wot {
	struct Id {
		Trustee[] trustees;
		mapping(address => bool) included;
	}

	struct Trustee {
		address addr;
		uint level;
	}

	event Verified(address indexed trustee, address who);

	function Wot (address _ethid) {
		admin = tx.origin;
		ethid = _ethid;
	}

	// verify verifies the key in `who` using `level` to indicate the trust
	// level. The rust level, for now, can be either 0 for marginal or 1 for
	// `complete`.
	function verify(address ref, address who, uint level) {
		if(msg.sender != ethid) throw;

		if(level > 1) throw;

		Id id = ids[ref];
		if(id.included[who]) throw;

		id.trustees.push(Trustee(who, level));
		id.included[who] = true;

		Verified(who, ref);
	}

	// verifyMarginally attempts to verify a trustee by which at least 2
	// other trustees verify this key who meet the 'marginal' level.
	function verifyMarginally(address ref, address who) constant returns(bool) {
		Id id = ids[ref];

		uint sigs;
		for(var i = 0; i < id.trustees.length && sigs < 2; i++) {
			if( ids[id.trustees[i].addr].included[who] ) {
				sigs++;
			}
		}
		return sigs >= 2;
	}

	// visited registers the nodes that have been "seen" during the
	// velidation process. It's never actually used to store any real
	// data other than during non-persisting `call`s. This seen known visited
	// data is important so that we do not traverse nodes multiple times.
	mapping(address => bool) visited;
	// valid returns whether the key could be verified and returns the path
	// of least resistance (i.e. smallest arc)
	function validate(address ref, address verify, uint maxDepth) constant returns(bool) {
		if(maxDepth == 0) return false;

		Id id = ids[ref];

		uint sigs;
		for(var i = 0; i < id.trustees.length; i++) {
			Trustee trustee = id.trustees[i];
			if(visited[trustee.addr]) continue;
			visited[trustee.addr] = true;

			// if we can verify this key marginal and it isn't the
			// key we were after can continue down this path. Or
			// if the key is completely trusted we can go down this
			// path without additional checks or use the direct sig
			// which results in validity.
			if((trustee.level == 0 && verifyMarginally(ref, trustee.addr)) || trustee.level == 1) { // marginal
				if(trustee.addr == verify) {
					sigs++;
				} else {
					if(this.validate(trustee.addr, verify, maxDepth - 1)) {
						sigs++;
					}
				}
			}
		}

		// key is trusted if the amount of passed signatures is greater
		// or equal to the default (=1).
		return sigs >= amountOfSignaturesNeeded;
	}

	// ids stores nodes for each person participating in the WoT.
	mapping(address => Id) ids;
	// Amount of default signatures required to make a key pass for valid
	uint amountOfSignaturesNeeded = 1;
	// The admin. Me (jeff)
	address public admin;
	// The ethid contract controlling the verification process
	address public ethid;

	// Admin stuff
	function setDefaultSigs(uint n) {
		if(msg.sender != admin) throw;

		amountOfSignaturesNeeded = n;
	}
}
