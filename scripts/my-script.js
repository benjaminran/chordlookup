require([
    '$api/models'
    // Get the currently-playing track
    ], function(models) {

        var ADD_TO_PLAYLIST_CODES = [13, 81, 87, 69, 65, 83, 68, 90, 88, 67];
        var SKIP_SONG_CODES = [8, 85, 73, 79, 74, 75, 76, 77, 188, 190];

        // Load playlist    
        var playlist;
        models.Playlist.fromURI('spotify:user:1217788570:playlist:04nz6tE69txSWYm4M03l3q').load('tracks').done(function(pl) {
            playlist = pl;
        });

        models.player.load('track').done(updateCurrentTrack);
        // Update the DOM when the song changes
        models.player.addEventListener('change:track', updateCurrentTrack);

        document.onkeyup = function(e) {
            var code = e.keyCode;
            console.log(code);
            if (ADD_TO_PLAYLIST_CODES.indexOf(code) != -1) {
                notify("Added " + models.player.track.name + " to playlist.");
                addCurrentTrackToPlaylist();
            }
            else if (SKIP_SONG_CODES.indexOf(code) != -1) {
                notify("Skipped song.");
                models.player.skipToNextTrack();
            }            
        }

        var notificationBar = $("#notification-bar");
        function notify(notification) {
            notificationBar.html(notification);
            setTimeout(function(){notificationBar.html('<small>No new notifications.</small>');}, 5000);
        }

        function addCurrentTrackToPlaylist() {;
            playlist.tracks.add(models.player.track)
        }

        function updateCurrentTrack(){
            if (models.player.track != null) {
                var artists = models.player.track.artists;
                var artists_array = [];
                for(i=0;i<artists.length;i++) {
                    artists_array.push(artists[i].name);
                }

                displayUrl(formatUrl(models.player.track.name, artists_array));
            }
        }
        
        function displayUrl(url) {
            $("#container").html('<iframe id="iframe" src="' + url + '" frameBorder="0"><p>Your browser does not support iframes.</p></iframe>')
            $('#container iframe').bind('load', function() { console.log("iframe loaded."); });
        }

        function formatUrl(track, artists){
            var url = "http://tabs.ultimate-guitar.com/";
            url += artists[0].substring(0,1)+"/";
            url += artists[0].replace(/ /g,"_") + "/";
            url += track.replace(/ /g,"_") + "_crd.htm";//#cont";
            return url;
        }
    });
