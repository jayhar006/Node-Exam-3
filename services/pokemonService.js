const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);
const pokemonEndpoint = 'pokemons';

db.defaults({ pokemons: [] }).write();

exports.get = () => {
    const pokemons = db.get('pokemons').value();

    return pokemons;
};

exports.insert = (pokemon) => {
    const { name } = pokemon;

    const isPokemonExist =
        db
            .get('pokemons')
            .value()
            .filter((_) => _.name === name).length > 0;

    if (isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} already exist.`,
        };
    }
    else{
        db.get('pokemons').push(pokemonEndpoint).write();

    return {
        success: true,
    };
    }    
};

exports.get = () => {
    const pokemons = db.get(pokemonEndpoint).value();

    return pokemons;
};

exports.getByName = (pokeName) => {
    const pokemon = db.get(pokemonEndpoint)
                        .filter(n => compareName(n, pokeName));

    return pokemon;
};

exports.delete = (pokeName) => {
    const isPokemonPresent = db.get(pokemonEndpoint)
     .value()
     .filter(n => compareName(n, pokeName));
 
     if (isPokemonPresent.length === 0) {
         return {
             success: false,
             errorMessage: `Pokemon ${pokeName} not found.`,
         };
     }
 
     db.get(pokemonEndpoint)
     .remove(n => compareName(n, pokeName))
     .write();
 
     return {
         success: true,
     };
 
 };

exports.update = (pokeName, dataJson) => {
    const isPokemonPresent = db.get(pokemonEndpoint)
    .value()
    .filter(n => compareName(n, pokeName));

    if (isPokemonPresent.length === 0) {
        return {
            success: false,
            errorMessage: `Pokemon ${pokeName} not found.`,
        };
    }

    if (dataJson['type'] === "") {
        return {
            success: false,
            errorMessage: `type property is blank`,
        };
    }

    if (!JSON.stringify(dataJson).includes('type')) {
        return {
            success: false,
            errorMessage: `type property is missing`,
        };
    }

    db.get(pokemonEndpoint)
        .find({ name: pokeName })
        .assign(dataJson)
        .write();

    return {
        success: true,
    };

};




const compareName = (n, pokeName) => {
    if (n.name.localeCompare(pokeName, undefined, { sensitivity: 'accent' }) === 0) {
        return true;
    }
    return false;
};


