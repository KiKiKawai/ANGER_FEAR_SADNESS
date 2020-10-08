/*jshint esversion: 6 */
let condition;
let c_prime;
if (Math.random() < 0.5) {
    condition = 'S';
    c_prime = 'KUMMER';
} else {
    condition = 'N';
    c_prime = 'NEUTRAL';
}

let anger = ['ERZFEIND', 'HASSEN', 'ÄRGERNIS', 'FEHDE', 'ZORNIG', 'AGGRESSION', 'TOBEN', 'SAUER', 'STREIT', 'RACHE'];
let fear = ['PANIK', 'GEFAHR', 'FURCHT', 'SCHRECK', 'SPUKEN', 'GRUSELIG', 'HORROR', 'SCHAURIG', 'SORGEN', 'FLUCHT'];
let sad = ['WEHMUT', 'WITWER', 'TRAGIK', 'WEINEN', 'TRÄNE', 'BEDAUERN', 'EINSAM', 'TROSTLOS', 'BEILEID', 'TRAUER'];
let neu = ['PRESSE', 'FRÄULEIN', 'NEUGIER', 'SUCHE', 'GIGANT', 'TEMPO', 'ÜBEN', 'STREICHEN', 'ANONYM', 'LENKBAR'];

let prime_a = ['WUT'];
let prime_f = ['ANGST'];
let prime_s = ['KUMMER'];
let prime_n = ['NEUTRAL'];

/*SPECIAL PRACTICE WORDS*/
let pract_s = ['FEIND', 'MORDEN', 'BRUTAL', 'SCHAUDER', 'PANISCH', 'FÜRCHTEN', 'WAISE', 'TRAUERN', 'VERWEINT'];
let pract_n = ['FEIND', 'MORDEN', 'BRUTAL', 'SCHAUDER', 'PANISCH', 'FÜRCHTEN', 'TEST', 'SALZIG', 'PLAUDERN'];

let pract_anger = ['FEIND', 'MORDEN', 'BRUTAL'];
let pract_fear = ['SCHAUDER', 'PANISCH', 'FÜRCHTEN'];
let pract_sad = ['WAISE', 'TRAUERN', 'VERWEINT'];
let pract_neu = ['TEST', 'SALZIG', 'PLAUDERN'];

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
    stim_dict.forEach(function(element) { // determine prime & target categories
        if (element.prime == "WUT") {
            element.prime_cat = "anger";
        } else if (element.prime == "ANGST") {
            element.prime_cat = "fear";
        } else if (element.prime == "KUMMER") {
            element.prime_cat = "sad";
        } else if (element.prime == "NEUTRAL") {
            element.prime_cat = "neu";
        } else {
            console.log('Error in determining Prime Category');
        }

        if (anger.includes(element.target)) {
            element.target_cat = "anger";
        } else if (fear.includes(element.target)) {
            element.target_cat = "fear";
        } else if (sad.includes(element.target)) {
            element.target_cat = "sad";
        } else if (neu.includes(element.target)) {
            element.target_cat = "neu";
        } else {
            console.log('Error in determining Target Category');
        }
    });
    return stim_dict;
}

function prep_prac() {
    let prac_dict = [];
    let all_stims_p;
    let all_primes_p;
    if (condition == 'S') {
        all_stims_p = pract_s;
        all_primes_p = prime_a.concat(prime_f, prime_s);
    } else if (condition == 'N') {
        all_stims_p = pract_n;
        all_primes_p = prime_a.concat(prime_f, prime_n);
    } else {
        console.log('Condition Error');
    }
    for (let stim of all_stims_p) {
        for (let prim of all_primes_p) {
            prac_dict.push({
                prime: prim,
                target: stim,
                color: "black"
            });
        }
    }
    prac_dict.forEach(function(element) { // determine practice prime & target categories
        if (element.prime == "WUT") {
            element.prime_cat = "anger";
        } else if (element.prime == "ANGST") {
            element.prime_cat = "fear";
        } else if (element.prime == "KUMMER") {
            element.prime_cat = "sad";
        } else if (element.prime == "NEUTRAL") {
            element.prime_cat = "neu";
        } else {
            console.log('Error in determining Practice Prime Category');
        }

        if (pract_anger.includes(element.target)) {
            element.target_cat = "anger";
        } else if (pract_fear.includes(element.target)) {
            element.target_cat = "fear";
        } else if (pract_sad.includes(element.target)) {
            element.target_cat = "sad";
        } else if (pract_neu.includes(element.target)) {
            element.target_cat = "neu";
        } else {
            console.log('Error in determining Practice Target Category');
        }
    });
    let prac_len = 10;
    let outp = prac_dict.reduce((resultArray, item, index) => {
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

let stim_main1 = prep_stims();
let stim_main2 = prep_stims();

/*

let all_bw = neg_pics.concat(pos_pics);
let all_file_names = all_bw.concat(stim_main1, stim_main2);
*/
