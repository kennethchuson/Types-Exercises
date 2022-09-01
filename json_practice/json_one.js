const jsonLinkExample = [
    {
        "url": "one.com",
        "links": [ 
            {
                "url": "two.com", 
                "links": [],
            },
            {
                "url": "three.com", 
                "links": [],
            }
        ]
    },
    {
        "url": "four.com",
        "links": [ 
            {
                "url": "seven.com", 
                "links": [
                    {
                        "url": "one.com",
                        "links": [
                            {
                                "url": "eight.com",
                                "links": []
                            }
                        ]
                    }
                ],
            },
            {
                "url": "three.com", 
                "links": [],
            }
        ]
    }
]

function allURL(json) {
    let links = []; 

    if (Array.isArray(json)) {
        for (const entry of json) {
            links = links.concat(allURL(entry));
        }
    } else if (json !== null && typeof json !== "string") {
        const url = json.url;
        if (typeof url === "string") {
            links.push(url);
        }

        const sublinks = json.links;
        if (sublinks !== undefined) {
            links = links.concat(allURL(sublinks));
        }
    }
    return links

}

function allURL2(json) {
    // TODO: Implement me
    var store_url = [];
    if (json === null) {
        return [];
    }
    helperAllURL2(store_url, json);
    return store_url;
}

function helperAllURL2(url2, json) {
    if (typeof(json) === "object") {
        for (var i = 0; i < json.length; i++) {
            if (json[i].url) {
                url2.push(json[i].url);
            }
            if (json[i].links) {
                helperAllURL2(url2, json[i].links);
            }
        }
    }
}

console.log("recursion: ") 
console.log("one way: ") 
console.log(allURL(jsonLinkExample))

console.log("two way: ") 
console.log(allURL2(jsonLinkExample))


console.log("iterative: ") 
function iterCountURL(url, json) {
    let count = 0;
    const values = [json];

    while (values.length !== 0) {
        const value = values.pop();
        if (value === undefined) {
            // Shouldn't happen.
            break;
        }

        if (Array.isArray(value)) {
            value.forEach(entry => values.push(entry));
        } else if (value !== null && typeof value !== "string") {
            if (value.url === url) {
                count += 1;
            }

            const sublinks = value.links;
            if (sublinks !== undefined) {
                values.push(sublinks);
            }
        }
    }

    return count;
}

console.log(iterCountURL("one.com", jsonLinkExample)) 