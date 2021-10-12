function $main(args) {
    try {
        const itemList = $('.article_item').toArray();
        const data = itemList.map(v => {
            const find = (className) => {
                return $($(v).find(className)[0])
            };
            const title = find('.article_title').text();
            const desc = find('.article_preview').text();
            const originUrl = find('.js_domain_linkout').get(0).href;
            const result = {
                title,
                desc,
                originUrl,
            }
            return result;
        })
        return data
    } catch (e) {
        console.log(e)
        return {}
    }
}