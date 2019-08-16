module.exports = {
    title: '慎独',
    description: '谨慎独行, 勿忘初心.',
    // 导航栏
    themeConfig: {
        nav: [{
            text: '编程内功',
            items: [{
                text: '数据结构',
				link: ''
            },
            {
                text: '领域驱动',
				link: ''
            },
            {
                text: '设计模式',
                items: [{
                    text: '设计原则',
				link: ''
                },
                {
                    text: '创建型模式',
				link: ''
                },
                {
                    text: '结构型模式',
				link: ''
                },
                {
                    text: '行为型模式',
				link: ''
                }]
            }]
        },
		{
            text: 'Java',
            items: [{
                text: '基础',
				link: ''
            },
            {
                text: '并发',
				link: '/java/concurrent/'
            },
            {
                text: 'JVM',
				link: ''
            },{
				text: '源码',
				items: [{
					text: 'spring-framworck',
					link: '/java/source/spring-framework/1-19.7.12'
				}]
			}]
        },
        {
            text: '功能实现',
            items: [{
                text: 'Java相关',
                link: '/function-record/one'
            }]
        },
        {
            text: '文摘',
            link: '/summary/'
        },
        {
            text: '胡思',
            link: '/guide/'
        },
        {
            text: 'GitHub',
            link: 'https://github.com/hanlifei'
        }],
        sidebar: {
            '/summary/': [
				'',
				'JMM-Hollis-19.7.8',
				'transaction-19.7.14'
            ],
			'/function-record/': [
				'',
				'one'
            ],
			'/java/source/spring-framework/': [
				'1-19.7.12',
				'2-19.7.20',
				'3-19.7.23',
				'4-19.7.29',
				'reference-2-19.7.30',
				'reference-1-19.7.30'
			],
			'/java/concurrent/': [
				'1-19.7.8',
				'2-19.7.17'
			]
        }
        // 控制侧边栏选项的子选项是否一直处于展开状态
        //displayAllHeaders: true // 默认值：false
    }
}