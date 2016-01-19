"use strict";

const express       = require('express');
const http          = require('http');
const bodyParser    = require('body-parser');

module.exports = function(configFolder) {

    var app         = express();
    var keybindings = require(configFolder + "/keybindings.json");
    var keynames    = require("./keynames.json");
    var accounts    = require(configFolder + "/accounts.json");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.route('/keybinding/:section/:id')
        .get(function(req, res) {
            res.send(keybindings[req.params.section][req.params.id]);
        })
        .patch(function(req, res) {
            res.send(req.body);
        });

    app.get('/keyname/:id', function(req, res) {
        res.send({text: keynames[req.params.id]});
    });

    app.get('/accounts/', function(req, res) {
        res.send(accounts);
    });

    app.get('/accounts/latest', function(req, res) {
        var last = null;
        for (var i = accouts.length - 1; i >= 0; i--) {
            if (!last || accouts[i].last_login > last.last_login) {
                last = accouts[i];
            }
        };
        res.send(last);
    });

    app.route('/account/:id')
        .get(function(req, res) {
            res.send(accounts[req.params.id]);
        })
        .patch(function(req, res) {
            res.send(req.body);
        })
        .delete(function(req, res) {
            res.send(req.body);
        })
        .post(function(req, res) {
            if (!accounts[req.params.id]) {
                //:todo write to file
            }
        });

    var user = null;

    app.route('/user')
        .get(function(req, res) {
            if (user) {
                res.send(user);
            } else {
                res.send(401);
            }
        })
        .post(function(req, res) {
            user = req.body.data;
            user.token = req.body.config.headers.Authorization;
            res.send(user);
        });

    app.listen(13765);
};
