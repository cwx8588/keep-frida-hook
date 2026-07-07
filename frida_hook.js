// Frida script - monitor class loading and find VerificationCodeType
// Log all loaded classes matching Keep patterns

Java.performNow(function() {
    console.log('[+] Script loaded. Monitoring class loading...');
    
    // First, enumerate all currently loaded classes
    console.log('[+] Currently loaded Keep classes:');
    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.indexOf('gotokeep') !== -1 ||
                className.indexOf('keep') !== -1 ||
                className.indexOf('ob0') !== -1 ||
                className.indexOf('Verification') !== -1 ||
                className.indexOf('Encrypt') !== -1 ||
                className.indexOf('DexGuard') !== -1) {
                console.log('[KEEP] ' + className);
            }
        },
        onComplete: function() {
            console.log('[+] Initial enumeration complete');
        }
    });
    
    // Set up a listener for new classes being loaded
    console.log('[+] Setting up class load listener...');
    Java.enumerateClassLoaders({
        onMatch: function(loader) {
            console.log('[LOADER] ' + loader);
        },
        onComplete: function() {
            console.log('[+] Loader enumeration complete');
        }
    });
});

// Check periodically for new classes
var checkCount = 0;

function periodicCheck() {
    checkCount++;
    var prefix = '[' + checkCount + ']';
    
    Java.perform(function() {
        Java.enumerateLoadedClasses({
            onMatch: function(className) {
                if (className.indexOf('gotokeep') !== -1 ||
                    className.indexOf('ob0') !== -1 ||
                    className.indexOf('Verification') !== -1) {
                    console.log(prefix + ' NEW_KEEP_CLASS: ' + className);
                    // Try to hook if it's the target
                    if (className.indexOf('VerificationCodeType') !== -1) {
                        try {
                            var vct = Java.use(className);
                            console.log(prefix + ' Found VerificationCodeType! Dumping values...');
                            vct.h.implementation = function() {
                                var r = this.h();
                                console.log(prefix + ' [ENUM] h()=' + r + ' name=' + this.name());
                                return r;
                            };
                            var vals = vct.values();
                            console.log(prefix + ' Total: ' + vals.length);
                            vals.forEach(function(v) {
                                console.log(prefix + ' [ENUM] name=' + v.name() + ' h()=' + v.h());
                            });
                        } catch(e) {
                            console.log(prefix + ' Hook error: ' + e);
                        }
                    }
                }
            },
            onComplete: function() {
                if (checkCount < 12) {
                    setTimeout(periodicCheck, 10000);
                } else {
                    console.log('[+] Final check complete after ' + (checkCount * 10) + 's');
                }
            }
        });
    });
}

// Start periodic checks
setTimeout(periodicCheck, 5000);
