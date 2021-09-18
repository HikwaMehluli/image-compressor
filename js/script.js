
/*!
 * Image Compressor
 * https://github.com/HikwaMehluli/image-compressor
 *
 * Copyright (c) 2018-present Hikwa Mehluli
 * Released under the MIT license
 *
 */
window.addEventListener('DOMContentLoaded', function () {
    var Vue = window.Vue;
    var URL = window.URL || window.webkitURL;
    var ImageCompressor = window.ImageCompressor;

    new Vue({
        el: '#app',

        data: function () {
            var vm = this;

            return {
                options: {
                    checkOrientation: true,
                    maxWidth: undefined,
                    maxHeight: undefined,
                    minWidth: 0,
                    minHeight: 0,
                    width: undefined,
                    height: undefined,
                    quality: 0.8,
                    mimeType: '',
                    convertSize: 5000000,
                    success: function (file) {

                        // console.log('Output: ', file);

                        if (URL) {
                            vm.outputURL = URL.createObjectURL(file);
                        }

                        vm.output = file;
                        vm.$refs.input.value = '';
                    },
                },
                inputURL: '',
                outputURL: '',
                input: {},
                output: {},
            };
        },



        // File size before printing
        filters: {
            prettySize: function (size) {
                var kilobyte = 1024;
                var megabyte = kilobyte * kilobyte;

                if (size > megabyte) {
                    return (size / megabyte).toFixed(2) + ' MB';
                } else if (size > kilobyte) {
                    return (size / kilobyte).toFixed(2) + ' KB';
                } else if (size >= 0) {
                    return size + ' B';
                }

                return 'N/A';
            },
        },

        methods: {
            compress: function (file) {
                if (!file) {
                    return;
                }

                // console.log('Input: ', file);

                if (URL) {
                    this.inputURL = URL.createObjectURL(file);
                }

                this.input = file;
                new ImageCompressor(file, this.options);
            },

            change: function (e) {
                this.compress(e.target.files ? e.target.files[0] : null);
            },

            dragover: function (e) {
                e.preventDefault();
            },

            drop: function (e) {
                e.preventDefault();
                this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
            },
        },
    });



    // Detect file input support 
    var isFileInputSupported = (function () {

        // Handle devices which falsely report support
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }

        // Create test element
        var el = document.createElement("input");
        el.type = "file";
        return !el.disabled;
    })();

    // Add 'fileinput' class to html element if supported
    if (isFileInputSupported) {
        document.documentElement.className += "fileinput";
    }

});