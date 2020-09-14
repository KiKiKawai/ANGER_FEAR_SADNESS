/*jshint esversion: 6 */

let anger = ['ERZFEIND', 'HASSEN', 'ÄRGERNIS', 'FEHDE', 'ZORNIG', 'AGGRESSION', 'TOBEN', 'SAUER', 'STREIT', 'RACHE'];
let fear = ['PANIK', 'GEFAHR', 'FURCHT', 'SCHRECK', 'SPUKEN', 'GRUSELIG', 'HORROR', 'SCHAURIG', 'SORGEN', 'FLUCHT'];
let sad = ['WEHMUT', 'WITWER', 'TRAGIK', 'WEINEN', 'TRÄNE', 'BEDAUERN', 'EINSAM', 'TROSTLOS', 'BEILEID', 'TRAUER'];
let neu = ['PRESSE', 'FRÄULEIN', 'NEUGIER', 'SUCHE', 'GIGANT', 'TEMPO', 'ÜBEN', 'STREICHEN', 'ANONYM', 'LENKBAR'];


let stim_dict = [];

/*SPECIAL PRACTICE WORDS*/

/*PRIME-TARGET DICTIONARY/OBJECT*/
if (condition == 'S') {
    let all_stims = anger.concat(fear, sad);
}
else if (condition == 'N') {
    let all_stims = anger.concat(fear, neu);

}
else {
    console.log('Condition Error');
}


neg_pics = shuffle(neg_pics);
pos_pics = shuffle(pos_pics);

function prep_prac() {
    let pracs = [];
    neg_pics.forEach((it, i) => {
        pracs.push(it);
        pracs.push(pos_pics[i]);
    });
    let prac_len = 10;
    let outp = pracs.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / prac_len);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
    outp = outp.map(lst => shuffle(lst));
    return (outp);
}

let stim_practice = prep_prac();

let all_bw = neg_pics.concat(pos_pics);



let all_file_names = all_bw.concat(stim_main1, stim_main2);
