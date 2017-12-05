.PHONY: all clean

MAKEFLAGS += -j$(shell grep -c ^processor /proc/cpuinfo)

MSG_DIR = ../msg/
SRC_DIR = ../src/
TAR_DIR = ../ebin/
MSG_BUILD_BIN = ../3rd/gpb/bin/protoc-erl
MSG_BUILD_INC = ../3rd/gpb/include
MSG_BUILD_PATH = ./msg
MSG_SUFFIX = _pb
# proto
PRO_MSG = $(wildcard ../msg/*.proto)
MSG_OBJ = $(PRO_MSG:.proto=.mo)

# objects
ALL_SRC = $(shell find ./ -path $(MSG_BUILD_PATH) -prune -o -name \*.erl)
ALL_OBJ = $(ALL_SRC:.erl=.beam)

# dependence
all: $(MSG_OBJ) $(ALL_OBJ)

%.beam: %.erl
	erlc -o $(TAR_DIR) +nowarn_export_all -W2 -Werror $?

%.mo:%.proto
	$(MSG_BUILD_BIN) $? -o $(MSG_BUILD_PATH) -I $(MSG_DIR) -modsuffix $(MSG_SUFFIX)
	erlc -o $(TAR_DIR) -W2 -Werror -I $(MSG_BUILD_INC) \
	$(MSG_BUILD_PATH)/$(patsubst %.proto,%$(MSG_SUFFIX).erl,$(?F)) 

clean: 
	rm -rf $(TAR_DIR)/*.beam
