#!bin/bash

ALLPASS=0;

cd ~/Downloads/actualZips

for f in *; do
	PASS=0
	FILE=$f

	if [ ${#FILE} -eq 0 ]
	then
		echo "No game zip files found"
	fi

	echo ${FILE##*/}

	unzip -q -d ~/Downloads/workingDirectory/ ~/Downloads/actualZips/${FILE##*/}

	cd ~/Desktop/expected/
	EXPFILE=$(find . -type d -name "${FILE##*/}")
	if [ ${#EXPFILE} -eq 0 ]
	then
		echo "Expected file ".${FILE##*/}."not found"
	else
		cd ${FILE##*/}
	fi


	if ! diff -b ~/Downloads/workingDirectory/js/constants.js constants.js; then
		PASS=1
		ALLPASS=1
		echo "FAIL: constants.js"
	fi

	if ! diff -b ~/Downloads/workingDirectory/css/style.css style.css; then
		PASS=1
		ALLPASS=1
		echo "FAIL: style.css"
	fi

	if ! diff -b -q ~/Downloads/workingDirectory/index.html index.html; then
        	PASS=1
		ALLPASS=1
        	echo "FAIL: index.html"
	fi

	if ! diff -b ~/Downloads/workingDirectory/app.js app.js; then
	        PASS=1
		ALLPASS=1
	        echo "FAIL: app.js"
	fi

	cd ~/Downloads/workingDirectory/cardFiles
	for c in *; do
		CARD=$c
		if [ ${#CARD} -eq 0 ]
		then
			PASS=1
			ALLPASS=1
			echo "FAIL: card File Not found"
		else
			if ! diff -b -q ${CARD##*/} ~/Desktop/expected/${EXPFILE##*/};  then
				PASS=1
				ALLPASS=1
				echo "FAIL: cardFile name"
			fi
		fi
	done

	cd ../..
	rm -r ~/Downloads/workingDirectory/*

	if [ $PASS -eq 0 ]
	then
		printf "Pass\n\n"
	else
		printf "FAIL\n\n"
	fi
done

if [ $ALLPASS -eq 0 ]
then
	echo "All Pass"
else
	echo "Some Tests Failed"
fi
