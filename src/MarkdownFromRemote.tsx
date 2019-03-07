import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Block from '@dojo/framework/widget-core/meta/Block';
import MarkdownFromRemoteBlock from './MarkdownFromRemote.block';
import { DNode } from '@dojo/framework/widget-core/interfaces';

interface MarkdownFromRemoteProperties {
	url: string;
	renderer(toc: any): DNode | DNode[];
}

export default class MarkdownFromRemote extends WidgetBase<MarkdownFromRemoteProperties> {
	render() {
		const { url, renderer } = this.properties;
		const content = this.meta(Block).run(MarkdownFromRemoteBlock)({ url }) || '';
		return renderer({ content });
	}
}
