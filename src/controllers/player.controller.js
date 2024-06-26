const logger = require("../models/logger.model.js");
const { createPlayerFilterQuery } = require('../utils/player.utils.js');
const db = require("../models/db.model.js");
const Player = db.player;

const DIR = '/api/images/players/';

// Create and Save a new Player
exports.create = (req, res) => {
    logger.debug('players create called');

    const url = req.protocol + '://' + req.get('host')

    // Create a Player
    const player = new Player({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nickname: req.body.nickname,
        profileImg: req.file ? url + DIR + req.file.filename : ''
    });

    // Save Player in the database
    player.save(player)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Player."
            });
        });
};

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
    logger.debug("players find all called!");
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Player.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving players."
            });
        });
};

// Find a single Player with an id
exports.findOne = (req, res) => {
    logger.debug("players find one called!");
    const id = req.params.id;

    Player.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Not found Player with id " + id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            logger.error('Error retrieving player ' + id + ', ' + err);
            res.status(500)
                .send({ message: "Error retrieving Player with id=" + id });
        });
};

// Find by search term
exports.findByIds = (req, res) => {
    logger.debug("players find by ids called!");
    let query = createPlayerFilterQuery(req.body);

    Player.find(query)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            logger.error('Failed to find players. ' + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while filter players."
            });
        });
}

// Find by search term
exports.findBySearchTerm = (req, res) => {
    logger.debug("players search called!");
    const searchTerm = req.query.search ? req.query.search : '';

    logger.debug('Searching players by searchTerm: ' + searchTerm);

    Player.find({
        $or: [
            { firstname: { $regex: searchTerm } },
            { lastname: { $regex: searchTerm } },
            { nickname: { $regex: searchTerm } }
        ],
    }).then(data => {
        res.send(data);
    }).catch(err => {
        logger.error(err);
        res.status(500).send({
            message: "Could not find player by search term " + searchTerm
        });
    });
}

// Update a Player by the id in the request
exports.update = (req, res) => {
    logger.debug("players update called!");
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const url = req.protocol + '://' + req.get('host');
    req.body.profileImg = req.file ? url + DIR + req.file.filename : '';

    const id = req.params.id;

    Player.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: `Cannot update Player with id=${id}. Maybe Player was not found!`
                });
            }
            return res.status(200).send({ message: "Player was updated successfully." });
        })
        .catch(err => {
            logger.error(err);
            return res.status(500).send({
                message: "Error updating Player with id=" + id
            });
        });
};

// Delete a Player with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    logger.debug("Delete player with id " + id);

    Player.findByIdAndDelete(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
                });
            } else {
                res.send({
                    message: "Player was deleted successfully!"
                });
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).send({
                message: "Could not delete Player with id=" + id
            });
        });
};