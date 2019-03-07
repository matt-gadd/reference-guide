import renderer from '@dojo/framework/widget-core/vdom';
import { tsx } from '@dojo/framework/widget-core/tsx';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Outlet from '@dojo/framework/routing/Outlet';
import has from '@dojo/framework/has/has';
import Registry from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import ReferenceGuide from './ReferenceGuide';
import ReferenceGuideContent from './ReferenceGuideContent';

import routes from './routes';

const registry = new Registry();

registerRouterInjector(routes, registry);

class App extends WidgetBase {
	render() {
		const url = "https://raw.githubusercontent.com/dojo/framework/master/docs/en/i18n/index.md";
		return (
			<Outlet id="i18n" renderer={ () => {
				return (
					<ReferenceGuide url={ url } renderer={ ({ toc }) => {
						const table = toc.map(({ value, href }: any) => {
							if (has('build-time-render')) {
								return <ReferenceGuideContent url={ href } renderer={ ({ content }) => null } />
							}
							else {
								return (
									<div>
										<a href={ `#i18n/${href}` }>{ value }</a>
									</div>
								)
							}
						});
						if (has('build-time-render')) {
							return table;
						}
						else {
							return [
								...table,
								<Outlet id="i18n-content" renderer={ ({ params }) => {
									const href = (window as any).location.hash.replace('#i18n/', '');
									return <ReferenceGuideContent url={ href } renderer={ ({ content }) => content } />
								} } />
							];
						}
					}} />
				);
			} } />
		);
	}
}

const r = renderer(() => <App />);
r.mount({ registry, domNode: document.getElementById('root') as HTMLElement });
