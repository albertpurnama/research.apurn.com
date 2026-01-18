Self Host vs Managed Host

Since everything is decentralized, self hosted clients can interact with managed host, given that they both are connected to Farcaster network.


### Making a text-short Cast[​](https://www.farcaster.xyz/docs/cast#making-a-text-short-cast "Direct link to heading")

Farcaster clients must generate a JSON object to create a new text-short cast. The message is set in the `text` property, and `publishedAt` , `address` and `username` are set with user input. Each new cast must have an incremented sequence number, which is used as a [logical clock](https://en.wikipedia.org/wiki/Logical_clock) to order a user’s messages. It must also reference the `merkleRoot` of the previous cast.

The pseudocode for generating a new cast looks like this:

1.  Retrieve the list of casts as a JSON array from the Directory’s addressActivity URL
2.  Get the `sequence` from the cast at position 0 and increment it by 1 to get the new `sequence`
3.  Get the `merkleRoot` from the cast at position 0 and set it as the `prevMerkleRoot`. If this is the first cast, set the `prevMerkleRoot` to the keccak256 of an empty string²
4.  Populate `text` , `publishedAt`, `address` and `username` based on user input and system state.
5.  Call `JSON.stringify` on the body and then use `keccak256` on the output to get the `merkleRoot` and set it.
6.  Create an ECDSA signature using the `merkleRoot` with the address to get the `signature` value.
7.  Insert this new cast at position 0 in the array, nudging down all other casts by one position.
8.  Save this array of casts back in the addressActivity URL