
"use strict";

const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
const cheerio = require('cheerio');

module.exports.urlToFilename = function urlToFilename(url){
    const parseUrl = urlParse(url);
    const urlPath = parseUrl.path.split('/')
    /**filter function element, index, array input  */
    .filter(function(component){
        return component !== '';
    })
    .map(function(component){
        return slug(component);
    })
    .join('/');
    let filename = path.join(parseUrl.hostname, urlPath);
    if(!path.extname(filename).match(/htm/)){
        filename += '.html';
    }
    return filename;
};

module.exports.getLinkUrl = function getLinkUrl(currentUrl, element){
    const link = urlResolve(currentUrl, element.attribs.href || "");
    const parseLink = urlParse(link);
    const currentParseUrl = urlParse(link);
    if(parseLink.hostname !== currentParseUrl.hostname || !parseLink.pathname){
        return null;
    }
    return link;
};

module.exports.getPageLinks = function getPageLinks(currentUrl, body){
    return [].slice.call(cheerio.load(body)('a'))
    .map(function(element){
        return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element){
        return !!element;
    });
};