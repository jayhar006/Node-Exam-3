const { pokemonService } = require('../services');
const url = require('url');
const { update } = require('../services/pokemonService');

exports.handleGetRequest = (req, res) => {
    const pokemonUrl = new URL(req.url, `http://${req.headers.host}`);

    let data;
    if (pokemonUrl.toString().includes('?name')) {
        console.log(pokemonUrl.searchParams);
        const params = pokemonUrl.searchParams;
        data = pokemonService.getByName(params.get('name'));
    } else {
        data = pokemonService.get();
    }

    const result = { data };

    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify(result));
    res.end();
};

exports.handlePostRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const result = pokemonService.insert(dataJson);

        if (!result.success) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
        }
        else{
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
        }
        res.end();
    });
};

exports.handlePutRequest = (req, res) => {
    const pokemonUrl = new URL(req.url, `http://${req.headers.host}`);

    if (pokemonUrl.toString().includes('?name')) {
        const params = pokemonUrl.searchParams;
        const pokeName = params.get('name');

        const data = [];

        req.on('data', (chunk) => {
            data.push(chunk);
        });

        req.on('end', () => {

            const parsedData = Buffer.concat(data).toString();
            const dataJson = JSON.parse(parsedData);

            const result = pokemonService.update(pokeName, dataJson);

            if (!result.success) {
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                });
                res.write(JSON.stringify(result));
            } else {
    
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.write(JSON.stringify(result));
            }
            res.end();
        });

    } else {
        const errorMsg = {
            success: false,
            errorMessage: `name parameter is missing.`,
        };

        res.writeHead(400, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(errorMsg));
        res.end();
    }
    

};

exports.handleDeleteRequest = (req, res) => {
    const pokemonUrl = new URL(req.url, `http://${req.headers.host}`);

    if (pokemonUrl.toString().includes('?name')) {

        const params = pokemonUrl.searchParams;
        const result = pokemonService.delete(params.get('name'));

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));

    } else {
        const errorMsg = {
            success: false,
            errorMessage: `name parameter is missing.`,
        };

        res.writeHead(400, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(errorMsg));
    }
    res.end();
};
