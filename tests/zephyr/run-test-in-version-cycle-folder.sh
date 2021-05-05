thispath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
pushd $thispath

pip3 install -q -r requirements.txt

branchName=`echo "$1" | sed 's/__/ /g'`
IFS='/' read -ra vcf <<< "$branchName"
mkdir -p ../temp
python3 list-tests-in-version-cycle-folder.py "${vcf[1]}" "${vcf[2]}" "${vcf[3]}" | cut -f2 | while read jiraKey; do
    cp ../group*/*-$jiraKey-*.test.ts ../temp
done

popd

headless=true record_api_call=true npm test -- --runInBand --json --outputFile=tests/output/jest-result.json tests/temp

pushd $thispath
python3 update_zephyr_from_ci.py "../output/jest-result.json" "${vcf[1]}" "${vcf[2]}" "${vcf[3]}"
popd


