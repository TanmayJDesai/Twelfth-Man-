const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin.js");

const Team = mongoose.model("Team");

/*
    Fetch a team
*/
router.get("/team/:id", (req, res) => {
    Team.findOne({ _id: req.params.id })
        .then((team) => res.status(200).json(team))
        .catch((err) => {
            return res.status(400).json({
                error: "Couldn't find team with given ID",
            });
        });
});

/*
    Create a team
*/
router.post("/team/create", requireLogin, (req, res) => {
    const { name, captain, roster } = req.body;
    if (!name || !captain) {
        return res.status(422).json({
            error: "Missing required parameter",
        });
    }

    Team.findOne({ name: name })
        .then((savedTeam) => {
            if (savedTeam) {
                return res.status(422).json({
                    error: "Team with this name already exists",
                });
            }

            const newTeam = new Team({
                name: name,
                captain: captain,
                roster: roster ? roster : Array(11),
            });

            newTeam
                .save()
                .then((team) => res.json(team))
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

/*
    Update a team
*/
router.patch("/team/update/:id", requireLogin, (req, res) => {
    const { name, captain, roster } = req.body;
    Team.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { name, captain, roster } }
    )
        .then((response) => res.status(200).json(response))
        .catch((err) => {
            return res.status(400).json({
                error: "Error updating team",
            });
        });
});

/*
    Delete a team
*/
router.delete("/team/delete/:id", requireLogin, (req, res) => {
    Team.findOneAndDelete({ _id: req.params.id })
        .then((response) => res.status(200).json(response))
        .catch((err) => {
            return res.status(400).json({
                error: "Error deleting team",
            });
        });
});

module.exports = router;