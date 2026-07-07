// Frida script - enumerate all loaded classes to find VerificationCodeType

Java.performNow(function() {
    console.log('[+] Script loaded. Enumerating loaded classes...');
    
    // Search for relevant classes
    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.indexOf('VerificationCodeType') !== -1 ||
                className.indexOf('verificationCodeType') !== -1 ||
                className.indexOf('verification_code') !== -1 ||
                className.indexOf('sms') !== -1 ||
                className.indexOf('Sms') !== -1 ||
                className.indexOf('login') !== -1 ||
                className.indexOf('Login') !== -1 ||
                className.indexOf('account') !== -1 ||
                className.indexOf('Account') !== -1) {
                console.log('[CLASS] ' + className);
            }
        },
        onComplete: function() {
            console.log('[+] Enumeration complete');
        }
    });
    
    // Also try to find ob0 class directly
    try {
        console.log('[+] Trying direct class lookup...');
        
        // Try known obfuscated patterns
        var patterns = [
            'ob0.f',
            'ob0',
            'com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType',
            'com.gotokeep.keep.fd.business.account.login.view.a',
            'com.gotokeep.keep.fd.business.account.login.view.b',
            'com.gotokeep.keep.fd.business.account.login.LoginViewModel'
        ];
        patterns.forEach(function(cls) {
            try {
                var c = Java.use(cls);
                console.log('[+] FOUND class: ' + cls);
                // List its methods
                var methods = c.class.getDeclaredMethods();
                for (var i = 0; i < methods.length; i++) {
                    console.log('[METHOD] ' + methods[i].toString());
                }
            } catch(e) {
                // Class not found, ignore
            }
        });
    } catch(e) {
        console.log('[!] Direct lookup error: ' + e);
    }
});

// Keep checking for loaded classes every 5 seconds for 30 seconds
var checkInterval = 5;
var maxChecks = 6;
var checkCount = 0;

function checkClasses() {
    checkCount++;
    console.log('[+] Check #' + checkCount + ' at ' + (checkCount * checkInterval) + 's');
    
    Java.perform(function() {
        Java.enumerateLoadedClasses({
            onMatch: function(className) {
                if (className.indexOf('VerificationCodeType') !== -1 ||
                    className.indexOf('sms') !== -1 ||
                    className.indexOf('Sms') !== -1 ||
                    className.indexOf('ob0') !== -1) {
                    console.log('[LATE_CLASS] ' + className);
                    // Try to hook it
                    try {
                        var target = Java.use(className);
                        if (className.indexOf('VerificationCodeType') !== -1) {
                            console.log('[+] Found VerificationCodeType! Hooking h()...');
                            target.h.implementation = function() {
                                var result = this.h();
                                console.log('[ENUM] h() = ' + result);
                                console.log('[ENUM] name = ' + this.name());
                                return result;
                            };
                            // Dump values
                            var values = target.values();
                            console.log('[+] Total enum constants: ' + values.length);
                            values.forEach(function(v) {
                                console.log('[ENUM] name=' + v.name() + ' h()=' + v.h());
                            });
                        }
                    } catch(e) {
                        console.log('[!] Hook failed for ' + className + ': ' + e);
                    }
                }
            },
            onComplete: function() {
                if (checkCount < maxChecks) {
                    setTimeout(checkClasses, checkInterval * 1000);
                } else {
                    console.log('[+] All checks complete');
                }
            }
        });
    });
}

// Start periodic checking after 3 seconds (let app settle)
setTimeout(checkClasses, 3000);
