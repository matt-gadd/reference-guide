export default [
	{
		path: 'i18n',
		outlet: 'i18n',
		children: [
			{
				path: '{href}',
				outlet: 'i18n-content'
			}
		]
	}
]
