// Frida script to dump all VerificationCodeType enum values
// Hook VerificationCodeType.h() method to capture return values

Java.perform(function() {
    try {
        // 方法1: Direct hook on VerificationCodeType class
        var VerificationCodeType = Java.use('com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType');
        console.log('[+] Found VerificationCodeType class');
        
        // Hook h() method - returns the type string value
        VerificationCodeType.h.implementation = function() {
            var result = this.h();
            console.log('[+] VerificationCodeType.h() = ' + result);
            console.log('[+] Enum name: ' + this.name());
            return result;
        };
        
        // Dump all enum values
        var values = VerificationCodeType.values();
        console.log('[+] Total enum constants: ' + values.length);
        values.forEach(function(v) {
            console.log('[ENUM] name=' + v.name() + ' h()=' + v.h());
        });
        
    } catch(e) {
        console.log('[!] Method 1 failed: ' + e);
    }
    
    // 方法2: Hook the SMS sender method instead
    try {
        console.log('[+] Trying Method 2: Hook SMS sender...');
        
        // Hook ob0/f.b() - the method that builds SMS request
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
    
    // 方法3: Hook all enum toString/valueOf
    try {
        console.log('[+] Trying Method 3: Hook enum toString...');
        var VerificationCodeType = Java.use('com.gotokeep.keep.fd.business.account.login.view.VerificationCodeType');
        
        VerificationCodeType.toString.implementation = function() {
            var result = this.toString();
            console.log('[toString] ' + result);
            return result;
        };
    } catch(e) {
        console.log('[!] Method 3 failed: ' + e);
    }
});

// Auto-exit after 5 seconds to allow hooks to fire
setTimeout(function() {
    console.log("[+] Auto-exiting after 5 seconds");
    Process.exit(0);
}, 5000);
