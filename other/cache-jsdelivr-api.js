// Fetch all latest & todays links to cache the data by jsdelivr
let url = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/"
let apiLinks = [url]
let extensions = [".min.json", ".json"]


async function begin() {

    for (let dateValue of ['latest', new Date().toISOString().substring(0, 10)]) {


        let data = await fetch(`${url}/${dateValue}/currencies.json`).then(res => res.json())
        let currencies = Object.keys(data)


        await multipleFetch(getURLs(`${url}/${dateValue}/currencies`))

        for (let curr of currencies) {
            let promiseHolder = []

            promiseHolder.push(multipleFetch(getURLs(`${url}/${dateValue}/currencies/${curr}`)))

            for (let curr2 of currencies)
                promiseHolder.push(multipleFetch(getURLs(`${url}/${dateValue}/currencies/${curr}/${curr2}`)))

            await Promise.allSettled(promiseHolder)
        }



    }





}

async function multipleFetch(links) {
    for (let link of links)
        await fetch(link, { method: 'HEAD' })
}

function getURLs(endpoint, links) {
    links = links || apiLinks
    return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}

begin()