var rp            = require('request-promise');
var cheerio       = require('cheerio');

module.exports = {

  // USING SINGLE PROMISE LAYER TO SCRAPE BASIC APT DATA
  getApts : function(req, res, next) {
    var location   = req.query.location
    location = location.toLowerCase().replace(/ /g, '-').replace(/,/g, '')
    var listingUrl = "http://www.apartments.com/apartments/" + location + "/";
    var listing    = {
                        uri: listingUrl,
                        transform: function(html) {
                          return cheerio.load(html);
                        }
                      };
    rp(listing).then(function($) {
      var apts = [];
      $('article').map(function(i, element) { // QUESTION
        var apt = {};
        var name    = $(element).find('.placardTitle').attr('title'),
            url     = $(element).attr('data-url'),
            address = $(element).find('.streetAddress').text(),
            rent    = $(element).find('.altRentDisplay').text(),
            unit    = $(element).find('.unitLabel').text(),
            avail   = $(element).find('.availabilityDisplay').text(),
            contact = $(element).find('.contactInfo').children().first().text(),
            update  = $(element).find('.lastUpdated').text(),
            bgUrl   = $(element).find('meta').attr('content');
        if(name && url && address && avail == 'Available Now') {
          apt.name = name
          apt.url = url
          apt.city = location
          apt.address = address
          apt.rent = rent
          apt.unit = unit
          apt.availability = avail
          apt.contact = contact
          apt.lastUpdated = update
          apt.previewImage = bgUrl
          apts.push(apt);
        }
      })
      res.json(apts);
    }).catch(function(err){
      res.json(err)
    })
  }

  // USING SECOND PROMISE LAYER TO SCRAPE DETAILED APT DATA
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
