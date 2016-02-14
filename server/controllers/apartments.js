var rp            = require('request-promise');
var cheerio       = require('cheerio');
var request       = require('request');

module.exports = {

  //
  // USING SINGLE PROMISE LAYER
  //
  getApts : function(req, res, next) {
    var location   = "downtown-los-angeles-los-angeles-ca"; // to be from req.
    var listingUrl = "http://www.apartments.com/apartments/" + location + "/";
    var listing    = {
                        uri: listingUrl,
                        transform: function(html) {
                          return cheerio.load(html);
                        }
                      };
    rp(listing).then(function($) {
      var apts = [];
      $('article').map(function(i, element) {
        var apt = {};
        if($(element).hasClass('platinum') || $(element).hasClass('gold') || $(element).hasClass('silver')) {
        var name    = $(element).children().first().text()
            // url     = $(element).children()[0].attr('href'),
            // address = $(element).children()[1].children()[1].children()[2].children()[0].text(),
            // rent    = $(element).children()[1].children()[1].children()[3].children()[0].text(),
            // unit    = $(element).children()[1].children()[1].children()[3].children()[1].text(),
            // avail   = $(element).children()[1].children()[1].children()[3].children()[2].text(),
            // contact = $(element).children()[1].children()[1].children()[4].children()[0].text(),
            // update  = $(element).children()[1].children()[1].children()[4].children()[1].text()
          if(name) {
            apt.name = name;
            // apt.url = url;
            // apt.address = address;
            // apt.rent = rent;
            // apt.unit = unit;
            // apt.availability = avail;
            // apt.contact = contact;
            // apt.lastupdated = update;
            apts.push(apt);
          }
        } else if($(element).hasClass('bronze')) {

        }
      })
      res.json(apts)
    })
  }

  //
  // USING SECOND PROMISE LAYER TO SCRAPE APT DATA
  //
  // getApts : function(req, res, next) {
  //   var location   = "downtown-los-angeles-los-angeles-ca"; // to be from req.
  //   var listingUrl = "http://www.apartments.com/apartments/" + location + "/";
  //   var listing    = {
  //                       uri: listingUrl,
  //                       transform: function(html) {
  //                         return cheerio.load(html);
  //                       }
  //                     };
  //   var listingPromise = rp(listing).then(function($) {
  //     var aptUrls = [];
  //     $('article').map(function(i, tag) {
  //       var href = $(tag).attr('data-url');
  //       if(href) aptUrls.push(href);
  //     })
  //     return aptUrls
  //   })
  //   var aptPromises = [];
  //   var aptsPromise = listingPromise.then(function(urls){
  //     urls.forEach(function(url) {
  //       aptPromises.push(rp(url));
  //     })
  //     return Promise.all(aptPromises);
  //   })
  //   aptsPromise.then(function(htmls) {
  //     htmls.forEach(function(html) {
  //       var $ = cheerio.load(html);
  //       var entry = { name:''};
  //       entry.name = $('.propertyDisplayName').text()
  //       console.log(entry.name);
  //     })
  //   })
  // }



}
