minify: real-minify test-minified

real-minify: strftime.js
	rm -f strftime-min.js
	closure <strftime.js >|strftime-min.js

test:
	TZ=America/Vancouver node test/test.js
	TZ=CET node test/test.js

debug:
	TZ=America/Vancouver node --debug-brk test/profile.js

perfomace:
	TZ=America/Vancouver node test/perfomace.js	

test-minified: minify
	TZ=America/Vancouver node test/test.js ../strftime-min.js
	TZ=CET node test/test.js ../strftime-min.js

.PHONY: test test-minified
