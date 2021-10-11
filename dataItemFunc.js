export default (args) => {
    return new Promise((resolve) => {
        const itemList = $('article_item');
        const data = itemList.map(v => {
            const find = (className) => $(v).find(className)[0] || {};
            const title = find('.article_title').text;
            const desc = find('.article_preview').text;
            const originUrl = find('.js_domain_linkout').href
            const result = {
                data,
                title,
                desc,
            }
            resolve(result)
        })
    })
}