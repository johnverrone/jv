export JV_HOME := $(shell pwd)

BEAN_PKGS := $(shell find go/beans -type d -regex '.*/beans/[^/]*/main')

# A make recipe for each go service (bean)
define make-go-bean
.PHONY:	$1
$1:
	go build -o $(JV_HOME)/go/bin/$1 jv/$2
endef

$(eval $(foreach pkg,$(BEAN_PKGS),$(call make-go-bean,$(lastword $(subst /, ,$(patsubst %/main,%,$(pkg)))),$(pkg))))
