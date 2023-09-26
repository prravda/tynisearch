"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tynisearch_1 = require("tynisearch");
const instance = new tynisearch_1.TyniSearch();
instance.insert("hello");
instance.insert("world");
instance.buildFailureLinks();
