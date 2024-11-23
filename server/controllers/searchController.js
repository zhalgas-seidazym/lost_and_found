

const Found = require('../models/Found')

const search = async (req, res) => {
    const { query } = req.body 
    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' })
    }

    try {
        const results = await performSearch(query)
        res.status(200).json(results)
    } catch (error) {
        console.error('Search failed', error)
        res.status(500).json({message: 'Failed to search items'})
    }
}

async function performSearch(query) {
    const { Client } = require('@elastic/elasticsearch')
    const client = new Client({ node: 'http://localhost:9200' })

    const { body } = await client.search({
        index: 'founditems',
        body: {
            query: {
                multi_match: {
                    query: query,
                    fields: ['name', 'description'],
                    fuzziness: "AUTO"
                }
            }
        }
    })

    return body.hits.hits.map(hit => hit._source)
}

module.exports = {
    search
}