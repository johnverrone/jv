export JV_HOME := $(shell pwd)

BEAN_PKGS := $(shell find projects/go/beans -type d -regex '.*/beans/[^/]*/main')

test:
	@echo $(BEAN_PKGS)
	$(foreach pkg,$(BEAN_PKGS),@echo $(lastword $(subst /, ,$(patsubst %/main,%,$(pkg)))))

# A make recipe for each go service (bean)
define make-go-bean
.PHONY:	$1
$1:
	go build -o $(JV_HOME)/projects/go/bin/$1 jv/$2
endef

$(eval $(foreach pkg,$(BEAN_PKGS),$(call make-go-bean,$(lastword $(subst /, ,$(patsubst %/main,%,$(pkg)))),$(pkg))))
