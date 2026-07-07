// Frida script to dump all VerificationCodeType enum values
// Hook VerificationCodeType.h() method to capture return values

Java.performNow(function() {
    // Method 1: Direct hook on VerificationCodeType class
    try {
        console.log('[+] Trying Method 1: Direct hook...');
        var VerificationCodeType = Java.use('com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType');
        console.log('[+] Found VerificationCodeType class');

        // Hook h() method - returns the type string value
        VerificationCodeType.h.implementation = function() {
            var result = this.h();
            console.log('[ENUM] h() = ' + result);
            console.log('[ENUM] name = ' + this.name());
            return result;
        };

        // Dump all enum values
        var values = VerificationCodeType.values();
        console.log('[+] Total enum constants: ' + values.length);
        values.forEach(function(v) {
            try {
                console.log('[ENUM] name=' + v.name() + ' h()=' + v.h());
            } catch(e2) {
                console.log('[ENUM] name=' + v.name() + ' h()=ERROR:' + e2);
            }
        });

    } catch(e) {
        console.log('[!] Method 1 failed: ' + e);
        console.log('[!] Stack: ' + e.stack);
    }

    // Method 2: Hook the SMS sender method instead
    try {
        console.log('[+] Trying Method 2: Hook SMS sender...');
        var ob0_f = Java.use('ob0.f');
        ob0_f.b.overload('com.gotokeep.keep.fd.business.account.login.view.PhoneNumberEntityWithCountry',
                          'com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType').implementation =
        function(phone, type) {
            console.log('[+] SMS send triggered!');
            console.log('[+] Phone: ' + phone.d());
            console.log('[+] Type enum name: ' + type.name());
            console.log('[+] Type h(): ' + type.h());
            var ret = this.b(phone, type);
            console.log('[+] SMS send result: ' + ret);
            return ret;
        };
    } catch(e) {
        console.log('[!] Method 2 failed: ' + e);
    }

    // Method 3: Hook toString
    try {
        console.log('[+] Trying Method 3: Hook toString...');
        var VerificationCodeType2 = Java.use('com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType');
        VerificationCodeType2.toString.implementation = function() {
            var result = this.toString();
            console.log('[toString] ' + result);
            return result;
        };
    } catch(e) {
        console.log('[!] Method 3 failed: ' + e);
    }
});

// Auto-exit after 30 seconds
setTimeout(function() {
    console.log('[+] Auto-exiting after 30 seconds');
}, 30000);
