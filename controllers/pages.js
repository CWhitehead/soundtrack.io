module.exports = {
  index: function(req, res, next) {
    Chat.find({}).limit(10).sort('-created').populate('_author _track _play').exec(function(err, messages) {
      Playlist.find({ _creator: ((req.user) ? req.user._id : undefined) }).sort('name').exec(function(err, playlists) {
        if (err) { console.log(err); }

        Artist.populate( messages, {
          path: '_track._artist'
        }, function(err, messages) {
          res.render('index', {
              messages: messages.reverse()
            , backup: []
            , playlists: playlists
            , room: req.app.room
          });
        })
      });

    });
  },
  about: function(req, res, next) {
    res.render('about', { });
  },
  history: function(req, res) {
    var limit = (req.param('limit')) ? parseInt(req.param('limit')) : 100;
    var skip = (req.param('skip')) ? parseInt(req.param('skip')) : 0;
    Play.find({}).populate('_track _curator').sort('-timestamp').limit(limit).skip(skip).exec(function(err, plays) {
      Artist.populate(plays, {
        path: '_track._artist'
      }, function(err, plays) {
        res.render('history', {
          plays: plays
          , limit: limit
          , skip: skip
        });
      });
    });
  }
}
