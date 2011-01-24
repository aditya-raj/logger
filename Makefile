GJSLINT = gjslint --unix_mode --strict --nojsdoc

test:
	@expresso -s test/test-*.js

lint:
	@$(GJSLINT) -r ./

.PHONY: test lint