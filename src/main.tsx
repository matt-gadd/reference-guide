import renderer from '@dojo/framework/widget-core/vdom';
import { tsx } from '@dojo/framework/widget-core/tsx';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Outlet from '@dojo/framework/routing/Outlet';
import Registry from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import StateHistory from '@dojo/framework/routing/history/StateHistory';
import Link from '@dojo/framework/routing/Link';
import './routerHack';

import ReferenceGuide from './ReferenceGuide';
import ReferenceGuideContent from './ReferenceGuideContent';

import routes from './routes';

const registry = new Registry();

registerRouterInjector(routes, registry, { HistoryManager: StateHistory });

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

const renderReferenceGuide = (name: string) => (
	<Outlet id={ `${name}-content` } renderer={ ({ params: { href } }) => {
		return <ReferenceGuideContent url={ href } renderer={ ({ content }) => content } />
	} } />
)

const render = (name: string, url: string) => (
	<div>
		<div classes={ ['side-nav'] }>
			<ReferenceGuide url={ url } renderer={ ({ toc }) => {
				addPages(name, toc);
				return renderToc(name, toc)
			}} />
		</div>
		<div classes={ ['content'] }>
			{ renderReferenceGuide(name) }
		</div>
	</div>
);

class App extends WidgetBase {
	render() {
		const url = "https://raw.githubusercontent.com/dojo/framework/master/docs/en/i18n/index.md";
		return (
			<Outlet id="i18n" renderer={ () => render('i18n', url) } />
		);
	}
}

const r = renderer(() => <App />);
r.mount({ registry, domNode: document.getElementById('root') as HTMLElement });
