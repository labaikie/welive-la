var rp            = require('request-promise');
var cheerio       = require('cheerio');
var request       = require('request');

module.exports = {

  getApts : function(req, res, next) {
    var location   = "downtown-los-angeles-los-angeles-ca"; // to be passed in through request
    var listingUrl = "http://www.apartments.com/apartments/" + location + "/";
    var listing    = {
                        uri: listingUrl,
                        transform: function(html) {
                          return cheerio.load(html);
                        }
                      };
    var listingPromise = rp(listing).then(function($) {
      var aptUrls = [];
      $('article').map(function(i, tag) {
        var href = $(tag).attr('data-url');
        if(href) aptUrls.push(href);
      })
      return aptUrls
    })
    var aptPromises = [];
    var aptsPromise = listingPromise.then(function(urls){
      urls.forEach(function(url) {
        var apt = {
                    uri: url,
                    transform: function(html) {
                      return cheerio.load(html);
                    }
                  }
        aptPromises.push(rp(apt))
      })
      return Promise.all(aptPromises)
    })
    aptsPromise.then(function(htmls){
      console.log(htmls)
    })








    // request(listingsUrl, function(err, res, html) {
    //   var aptUrls = [];
    //   if(!err) {
    //     var $ = cheerio.load(html);
    //     // names = $('article').children().children().first().text();
    //     $('article').map(function(i, tag) {
    //       var href = $(tag).attr('data-url');
    //       if(href) aptUrls.push(href);
    //     })
    //   }
    //   console.log(aptUrls);
    // })



  }

}
