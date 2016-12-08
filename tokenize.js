'use strict';

// note: this manipulates the topmost token in the tokens stack
// also the tokens stack is composed of objects rather than strings
let tokenize = (source) => {
	let tokens = [];
	let token = { type: "first", value: null };
	let character;
	
	function produceToken(type) {
		tokens.push(token); // or push(token);
		token = {
			type: type,
			value: character
		};
	}
	
	for (character of source) {
		// conditions to produce new token
		if (character === "[") {
			produceToken("start");
		} else if (character === "]") {
			produceToken("end");
		} else if (character === "$") {
			produceToken("template");
		} else if ([" ", "\r", "\n", "\t"].includes(character)) {
			if (token.type !== "space") produceToken("space");
			else token.value += character;
		} else if (token.type !== "name") {
			produceToken("name");
		// if no token produced, append character to current token
		} else {
			token.value += character;
		}
	}
	
	//console.log(tokens);
	
	// discard the first (null) token
	return tokens.slice(1);
}

module.exports = tokenize;
