import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Block from '@dojo/framework/widget-core/meta/Block';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import TableOfContentsFromRemoteBlock from './TableOfContentsFromRemote.block';

interface TableOfContentsFromRemoteProperties {
	url: string;
	renderer(toc: any): DNode | DNode[];
}

export default class TableOfContentsFromRemote extends WidgetBase<TableOfContentsFromRemoteProperties> {
	render() {
		const { url, renderer } = this.properties;
		const toc = this.meta(Block).run(TableOfContentsFromRemoteBlock)({ url }) || [];
		return renderer({ toc });
	}
}

