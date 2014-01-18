/* globals $data, $, console, runOnce, prompt*/

(function() {
    'use strict';
    var runOnce = window.runOnce = typeof window.runOnce === 'undefined',
        token;

    init();

    function runTestCode () {
        console.log('ctx', window.ctx);
    }

    // 1. load infrastructure files from remote host on first time
    // 2. get token to access secure endpoints
    // 3. setup ctx to add bearer token

    // When all done call runTestCode()
    function init () {
        //store ctx and token globally
        var libsUrl = 'http://rainerat.spirit.de/testLibs/',
            scripts = [
                'lib/datajs/datajs-1.1.1.min.js',
                'lib/jayData/1.3.5/jaydata.min.js',
                'lib/jayData/1.3.5/jaydataproviders/oDataProvider.min.js',
                'lib/jayData/1.3.5/jaydatamodules/deferred.min.js'
            ],
            index = 0;

        if ( runOnce ) {
            loadScript();
        }
        else {
            runTestCode();
        }

        function loadScript () {

            if ( index < scripts.length ) {

                $.getScript(libsUrl + scripts[index], function() {
                    console.log('Loaded: ' + scripts[index]);
                    index++;
                    loadScript();
                });
            }
            else {
                runOnce = false;
                getToken();
            }
        }

        function getToken () {
            var username = prompt('username'),
                password = prompt('password');

            $.ajax('/Token', {
                type: 'POST',
                data: 'grant_type=password&username=' + username + '&password=' + password
            }).then(function( resp ) {
                    token = resp.access_token;

                }).then(function() {
                    $data.service('/odata/$metadata', function( contextFactory, contextType ) {
                        var entityMap = [];

                        var context = contextFactory();
                        context.onReady(function() {
                            window.ctx = context;

                            context.prepareRequest = function( cfg ) {
                                cfg[0].headers.Authorization = 'bearer ' + token;
                            };

                            context.forEachEntitySet(function( entity ) {
                                entityMap.push({
                                    hash: '#svcId/' + encodeURIComponent(entity.name),
                                    name: entity.name
                                });
                            });

                        }).then(function() {
                                runTestCode();
                            });

                    }, { httpHeaders: { 'Authorization': 'bearer ' + token }});
                });
        }
    }
})();












