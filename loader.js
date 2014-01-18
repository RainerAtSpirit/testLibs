/*global $, console*/
(function() {
    'use strict';

    var username = '',
        password = '',
        hostname = '',
        runOnce = window.runOnce = true,
        token,
        scripts = [
            'lib/datajs/datajs-1.1.1.min.js',
            'lib/jayData/1.3.5/jaydata.min.js',
            'lib/jayData/1.3.5/jaydataproviders/oDataProvider.min.js',
            'lib/jayData/1.3.5/jaydatamodules/deferred.min.js'
        ],
        index = 0;


    if (runOnce){
        init();
    }




    function init () {
        loadScript();

        function loadScript(){
            //make sure the current index is still a part of the array
            if ( index < scripts.length ) {

                //get the script at the current index
                $.getScript(scripts[index], function() {

                    //once the script is loaded, increase the index and attempt to load the next script
                    console.log('Loaded: ' + scripts[index]);
                    index++;
                    loadScript();
                });
            }
            else{
                getToken();
            }
        }
    }

    function getToken () {

        //Getting a token and using it in plupload requests
        $.ajax('/Token', {
            type: 'POST',
            data: 'grant_type=password&username=' + username + '&password=' + password
        }).then(function( resp ) {
                token = resp.access_token;
            });
    }

})();
