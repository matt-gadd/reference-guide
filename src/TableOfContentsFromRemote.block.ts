const path = require('path');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const crypto = require('crypto');
const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');

function flatten(input: any[]) {
	let counter = 0;
	const nodes = [ ...input ];
	const results = [];
	while(nodes.length) {
		const node = nodes.shift();
		const id = node.id || counter++;
		let children: any[] = [];
		(node.children || []).forEach((child: any) => {
			if (!(child.type == 'text' && child.value === '\n')) {
				const childNode = { ...child };
				childNode.parent = node.id;
				childNode.id = counter++;
				nodes.unshift(childNode);
				children.push(childNode.id);
			}
		});
		results[id] = {
			id,
			type: node.type,
			tagName: node.tagName,
			parent: node.parent,
			children,
			value: node.value,
			href: node.properties ? node.properties.href : undefined
		};
	}
	return results;
}

function process(content: string) {
	const pipeline = unified()
		.use(markdown, { commonmark: true })
		.use(remark2rehype)

	const nodes = pipeline.parse(content);
	const result = pipeline.runSync(nodes);
	const flattenedResults = flatten(result);
	for(let i = 1; i < flattenedResults.length; i++) {
		const node = flattenedResults[i];
		if (node.tagName === 'li') {
			let firstChild = flattenedResults[node.children[0]];
			if (firstChild.tagName === 'a') {
				node.children.shift();
				node.href = firstChild.href;
				node.value = flattenedResults[firstChild.children[0]].value;
			}
			firstChild = flattenedResults[node.children[0]];
			if (firstChild && firstChild.tagName === 'ul') {
				node.children.shift();
				node.children.push(...firstChild.children);
			}
		}
	}
	const root = flattenedResults[0];
	const { children } = flattenedResults[root.children[0]];
	return resolveChildren(flattenedResults, children);
}

function resolveChildren(all: any[], indexes: any[]) {
	const results = [];
	for(let i = 0; i < indexes.length; i++) {
		const index = indexes[i];
		const resolved = all[index];
		const children: any[] = resolveChildren(all, resolved.children);
		results.push({ value: resolved.value, href: resolved.href, children });
	}
	return results;
}

export default function ({ url }: { url: string }) {
	const btrcache = path.resolve(__dirname, '../', '.btrcache');
	if (!fs.existsSync(btrcache)) {
		fs.mkdirSync(btrcache);
	}
	const hashed = crypto.createHash('md5').update(url).digest("hex");
	const cachedFile = path.resolve(btrcache, hashed);
	if (fs.existsSync(cachedFile)) {
		const content = fs.readFileSync(cachedFile, 'utf-8');
		return process(content);
	}
	else {
		return fetch(url)
			.then((response: any) => response.text())
			.then((content: string) => {
				fs.writeFileSync(cachedFile, content);
				return content;
			})
			.then((content: string) => process(content));
	}
}
