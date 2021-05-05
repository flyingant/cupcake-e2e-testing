thispath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
pushd $thispath

pip3 install -q -r requirements.txt

tagName=$1
git tag $tagName -n20 | sed "s/$tagName//g" | while read line; 
do
    echo "version/cycle/folder: $line"
    IFS=';' read -ra VCFS <<< "$line"
    for vcfStr in "${VCFS[@]}"; do
        IFS='/' read -ra vcf <<< "$vcfStr"
        ls ../output*/jest-result.json | sort | while read jestJson; do
            echo "Process $jestJson"
            if [ "$jestJson" != "" ] && [ "${vcf[0]}" != "" ] && [ "${vcf[1]}" != "" ]; then
                python3 update_zephyr_from_ci.py "$jestJson" "${vcf[0]}" "${vcf[1]}" "${vcf[2]}"
            fi
        done
    done
done

popd