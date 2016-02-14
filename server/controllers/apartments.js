var rp            = require('request-promise');
var cheerio       = require('cheerio');
var request       = require('request');

module.exports = {


  // USING SINGLE PROMISE LAYER
  getApts : function(req, res, next) {
    // TO BE MODIFIED : Location to be a part of the request
    var location   = "west-hollywood-ca";
    // var location   = "echo-park-los-angeles-ca";
    //var location   = "downtown-los-angeles-los-angeles-ca";
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
        var name    = $(element).children().first().text(),
            url     = $(element).attr('data-url'),
            address = $(element).find('.streetAddress').text(),
            rent    = $(element).find('.altRentDisplay').text(),
            unit    = $(element).find('.unitLabel').text(),
            avail   = $(element).find('.availabilityDisplay').text(),
            contact = $(element).find('.contactInfo').children().first().text(),
            update  = $(element).find('.lastUpdated').text(),
            img     = $(element).find('.imageContainer').find('.meta').attr('content')
        if(name && url && address && avail == 'Available Now') {
          apt.name = name
          apt.url = url
          apt.address = address
          apt.rent = rent
          apt.unit = unit
          apt.availability = avail
          apt.contact = contact
          apt.lastUpdated = update
          apt.previewImage = img
          apts.push(apt);
        }
      })
      console.log(apts.length)
      res.json(apts)
    })
  }


  // USING SECOND PROMISE LAYER TO SCRAPE APT DATA
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
