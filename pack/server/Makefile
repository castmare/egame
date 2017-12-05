.PHONY: all clean

# targets
TARGETS=3rd/gpb/ 3rd/log4erl/ 3rd/cowboy 3rd/lager
TARGETS+=src/ 
TARGETS_REV=`echo $(TARGETS) | sed 's, ,\n,g' | tac`

all: 
	for module in $(TARGETS); do cd $$module || exit $?;  make $@ || exit $?; cd -; done

clean:
	for module in $(TARGETS_REV); do cd $$module || exit $?; make $@ || exit $?; cd -; done

