(jq -r '.endTime,.startTime'  tests/output_*/jest-result.json  | paste - - | while read line; 
do 
    endTime=`echo "$line" | cut -f1 `; 
    startTime=`echo "$line" | cut -f2`; 
    expr $endTime - $startTime; done ) | sort -n | avg
