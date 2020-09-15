/*jshint esversion: 6 */

let anger = ['ERZFEIND', 'HASSEN', 'ÄRGERNIS', 'FEHDE', 'ZORNIG', 'AGGRESSION', 'TOBEN', 'SAUER', 'STREIT', 'RACHE'];
let fear = ['PANIK', 'GEFAHR', 'FURCHT', 'SCHRECK', 'SPUKEN', 'GRUSELIG', 'HORROR', 'SCHAURIG', 'SORGEN', 'FLUCHT'];
let sad = ['WEHMUT', 'WITWER', 'TRAGIK', 'WEINEN', 'TRÄNE', 'BEDAUERN', 'EINSAM', 'TROSTLOS', 'BEILEID', 'TRAUER'];
let neu = ['PRESSE', 'FRÄULEIN', 'NEUGIER', 'SUCHE', 'GIGANT', 'TEMPO', 'ÜBEN', 'STREICHEN', 'ANONYM', 'LENKBAR'];

let prime_a = ['WUT'];
let prime_f = ['ANGST'];
let prime_s = ['KUMMER'];
let prime_n = ['NEUTRAL'];

/*SPECIAL PRACTICE WORDS*/

/*PRIME-TARGET DICTIONARY/OBJECT*/
function prep_stims() {
    let stim_dict = [];
    let all_stims;
    let all_primes;
    let all_colors = ['red', 'gray'];
    if (condition == 'S') {
        all_stims = anger.concat(fear, sad);
        all_primes = prime_a.concat(prime_f, prime_s);
    } else if (condition == 'N') {
        all_stims = anger.concat(fear, neu);
        all_primes = prime_a.concat(prime_f, prime_n);
    } else {
        console.log('Condition Error');
    }
    for (let stim of all_stims) {
        for (let prim of all_primes) {
            for (let colr of all_colors) {
                stim_dict.push({
                    prime: prim,
                    target: stim,
                    color: colr
                });
            }
        }
    }
    return stim_dict;
}


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
