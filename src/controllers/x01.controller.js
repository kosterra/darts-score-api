const logger = require("../models/logger.model.js");
const db = require("../models/db.model.js");
const X01 = db.x01;
const { createGameFilterQuery } = require('../utils/game.utils.js');

// Create and Save a new X01 game
exports.create = (req, res) => {
    logger.debug("create x01 game called!");

    try {
        // Create a x01 Game
        const x01 = new X01(req.body);

        // Save X01 game in the database
        x01.save(x01)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                logger.error(err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the X01 game."
                });
            });
    } catch (error) {
        logger.error(error);
    }
};

// Retrieve all X01 games from the database.
exports.findByFilters = (req, res) => {
    logger.debug("x01 games find by filters called!");
    let query = createGameFilterQuery(req.body);

    X01.find(query)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            logger.error('Failed to find x01 games. ' + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while filter X01 games."
            });
        });
};

// Retrieve all X01 games from the database.
exports.findAll = (req, res) => {
    logger.debug("x01 games find all called!");
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    X01.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            logger.error('Failed to load all x01 games. ' + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving X01 games."
            });
        });
};

// Find a single X01 game with an id
exports.findOne = (req, res) => {
    logger.debug("x01 games find one called!");
    const id = req.params.id;

    X01.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found X01 game with id " + id });
            else res.send(data);
        })
        .catch(err => {
            logger.error('Error retrieving X01 game with id ' + id + ', ' + err);
            res.status(500)
                .send({ message: "Error retrieving X01 game with id " + id });
        });
};

// Update a X01 game by the id in the request
exports.update = (req, res) => {
    logger.debug("x01 games update called!");
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    X01.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update X01 game with id=${id}. Maybe X01 game was not found!`
                });
            } else res.send({ message: "X01 game was updated successfully." });
        })
        .catch(err => {
            logger.debug(err);
            res.status(500).send({
                message: "Error updating x01 game with id=" + id
            });
        });
};

// Delete a X01 game with the specified id in the request
exports.delete = (req, res) => {
    logger.debug("x01 games delete called!");
    const id = req.params.id;

    X01.findByIdAndDelete(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete X01 game with id=${id}. Maybe X01 game was not found!`
                });
            } else {
                res.send({
                    message: "X01 game was deleted successfully!"
                });
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).send({
                message: "Could not delete X01 game with id=" + id
            });
        });
};