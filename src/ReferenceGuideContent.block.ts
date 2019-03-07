const path = require('path');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const crypto = require('crypto');
const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const toH = require('hast-to-hyperscript');
const { v } = require('@dojo/framework/widget-core/d');

function process(content: string) {
	const pipeline = unified()
		.use(markdown, { commonmark: true })
		.use(remark2rehype)

	const nodes = pipeline.parse(content);
	const result = pipeline.runSync(nodes);
	return toH((...args: any[]) => v(...args), result);
}

export default function ({ url }: { url: string }) {
	url = `https://raw.githubusercontent.com/dojo/framework/master/docs/en/i18n/${url.substr(1)}`;
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
