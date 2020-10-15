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

let noun = ['ERZFEIND', 'ÄRGERNIS', 'FEHDE', 'AGGRESSION', 'STREIT', 'RACHE', 'PANIK', 'GEFAHR', 'FURCHT', 'SCHRECK', 'HORROR', 'SORGEN', 'FLUCHT', 'WEHMUT', 'WITWER', 'TRAGIK', 'TRÄNE', 'BEILEID', 'TRAUER', 'PRESSE', 'FRÄULEIN', 'NEUGIER', 'SUCHE', 'GIGANT', 'TEMPO'];
let adj = ['ZORNIG', 'SAUER', 'GRUSELIG', 'SCHAURIG', 'EINSAM', 'TROSTLOS', 'ANONYM', 'LENKBAR'];
let verb = ['HASSEN', 'TOBEN', 'SPUKEN', 'WEINEN', 'BEDAUERN', 'ÜBEN', 'STREICHEN'];

/* hard coded split halves */
let list1 = ['ERZFEIND', 'ÄRGERNIS', 'ZORNIG', 'TOBEN', 'STREIT', 'GEFAHR', 'SCHRECK', 'SPUKEN', 'GRUSELIG', 'FLUCHT', 'WEHMUT', 'WITWER', 'TRAGIK', 'WEINEN', 'EINSAM', 'FRÄULEIN', 'NEUGIER', 'GIGANT', 'ÜBEN', 'ANONYM'];
let list2 = ['HASSEN', 'FEHDE', 'AGGRESSION', 'SAUER', 'RACHE', 'PANIK', 'FURCHT', 'HORROR', 'SCHAURIG', 'SORGEN', 'TRÄNE', 'BEDAUERN', 'TROSTLOS', 'BEILEID', 'TRAUER', 'PRESSE', 'SUCHE', 'TEMPO', 'STREICHEN', 'LENKBAR'];

/*SPECIAL PRACTICE WORDS*/
let pract_s = ['FEIND', 'MORDEN', 'BRUTAL', 'SCHAUDER', 'PANISCH', 'FÜRCHTEN', 'WAISE', 'TRAUERN', 'VERWEINT'];
let pract_n = ['FEIND', 'MORDEN', 'BRUTAL', 'SCHAUDER', 'PANISCH', 'FÜRCHTEN', 'TEST', 'SALZIG', 'PLAUDERN'];

let pract_anger = ['FEIND', 'MORDEN', 'BRUTAL'];
let pract_fear = ['SCHAUDER', 'PANISCH', 'FÜRCHTEN'];
let pract_sad = ['WAISE', 'TRAUERN', 'VERWEINT'];
let pract_neu = ['TEST', 'SALZIG', 'PLAUDERN'];

/*PRIME-TARGET DICTIONARY/OBJECT*/
// havl1 = first block stimuli, halv2 = second block stimuli
function prep_stims(halv) { //--> list1 in col0 list2 in colr1
    let stim_dict = [];
    let all_stims;
    let all_primes;
    let all_colors = ['#f60000', '#009500']; // WILMS OBERFELD: MEDIUM/HIGH: ['#A90200', '#006600']; HIGH/HIGH: ['#f60000', '#009500']
    if (halv == 1) {
        all_colors = ['#f60000', '#009500'];
    } else if (halv == 2) {
        all_colors = ['#009500','#f60000'];
    } else {
        console.log('Preparation Error in All Color List');
    }

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
            if (list1.includes(stim)) {
                stim_dict.push({
                    prime: prim,
                    target: stim,
                    color: all_colors[0]
                });
            }
            if (list2.includes(stim)) {
                stim_dict.push({
                    prime: prim,
                    target: stim,
                    color: all_colors[1]
                });
            }
        }
    }

    stim_dict = assign_cats(stim_dict);
    return stim_dict;
}

function assign_cats(stmdcts) {
    stmdcts.forEach(function(element) { // determine prime & target categories
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

        if (noun.includes(element.target)) {
            element.word_type = "noun";
        } else if (adj.includes(element.target)) {
            element.word_type = "adj";
        } else if (verb.includes(element.target)) {
            element.word_type = "verb";
        } else {
            console.log('Error in determining Target Word Type for: ', element.target);
        }
    });
    return stmdcts;
}

let stim_main1 = shuffle(prep_stims(1));
let stim_main2 = shuffle(prep_stims(2));

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
    let prac_len = 9;
    let outp = prac_dict.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / prac_len);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
    outp = outp.map(lst => shuffle(lst));
    return outp;
}

let stim_practice = shuffle(prep_prac());
