import { tsx } from '@dojo/framework/widget-core/tsx';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Outlet from '@dojo/framework/routing/Outlet';
import Link from '@dojo/framework/routing/Link';

import TableOfContentsFromRemote from './TableOfContentsFromRemote';
import MarkdownFromRemote from './MarkdownFromRemote';

const renderToc = (name: string, items: any) => {
	return items.map(({ value, href, children = [] }: any) => {
		href = href.replace(/^\.\//, '').replace('.md', '');
		return (
			<ul>
				<li>
					<Link to={ `${name}-content` } params={ { href } }>{ value }</Link>
					{ children.length && renderToc(name, children) }
				</li>
			</ul>
		);
	});
}

const addPages = (name: string, toc: any) => {
	(window as any).__btrPaths = toc.map(({ href }: { href: string }) => `${name}/${href.replace(/^\.\//, '').replace(/#.*/, '').replace('.md', '')}`);
}

export default class ReferenceGuide extends WidgetBase<{ url: string, name: string }> {
	render() {
		const { url, name } = this.properties;
		return (
			<div>
				<div classes={ ['side-nav'] }>
					<TableOfContentsFromRemote url={ url } renderer={ ({ toc }) => {
						addPages(name, toc);
						return renderToc(name, toc)
					}} />
				</div>
				<div classes={ ['content'] }>
					<Outlet id={ `${name}-content` } renderer={ ({ params: { href } }) => {
						return <MarkdownFromRemote url={ href } renderer={ ({ content }) => content } />
					} } />
				</div>
			</div>
		);
	}
}
