'use strict';
const tokenize = require("./tokenize.js");

// input: linear, structured (array of tokens)
// output: recursive/nested linear (ast)
let parse = (source) => {
	let ast = [{ space: '', value: '%'}];
	let currentId = 0;
	let currentIds = [];
	let levelIds = [];
	let levels = [ast];
	let levelId = 0;

	let space = "";
	
	//console.log(source);
	source = tokenize(source);

	source.forEach((token) => {
		if (token.type === "space") { // /\s/.test(token[0]); // token.type === "space"/"separator"
			space = token.value;
		} else if (token.type === "start") {
			levels.push([]);
			let nextLevelId = levels.length - 1;
			
			// this could be simplified by making this function recrusive:
			levels[nextLevelId].push(levels[levelId][currentId]);
			levels[levelId][currentId] = levels[nextLevelId];
			levelIds.push(levelId);
			levelId = nextLevelId; // ?
			currentIds.push(currentId);
			currentId = 0;
		} else if (token.type === "end") {
			levelId = levelIds.pop();
			currentId = currentIds.pop();
		} else { // token.type === "name" || token.type === "template"
			levels[levelId].push({ space, value: token.value });
			space = "";
			currentId += 1;
		}
	});
	
	return ast;
};

module.exports = parse;
