/*jshint esversion: 6 */

let experiment_title = 'anger_fear';
let response_deadline = 1500;
let tooslow_delay = 500;
let false_delay = 500;
let actual_isi_delay_minmax = [300, 500];
//let raf_warmup = 100; // not needed
let basic_times = {};
let isi_delay_minmax = [actual_isi_delay_minmax[0], actual_isi_delay_minmax[1]]; //not needed
let yes_key, no_key;
if (Math.random() < 0.5) {
    yes_key = 'i';
    no_key = 'e';
} else {
    yes_key = 'e';
    no_key = 'i';
}

$(document).ready(() => {
    window.scrollTo(0, 0);
    let dropChoices = '';
    countrs.forEach((word) => {
        dropChoices += '<option value="' + word + '">' + word + '</option>';
    });
    $("#country").append(dropChoices);
    //canvas = document.getElementById('rate_canvas');
    detectmob();
    set_block_texts();
    console.log('showing block texts now');
    $('#loading_id').hide();
    $('#div_intro_general').show();
});

function consented() {
    $("#consent").hide();
    window.scrollTo(0, 0);
    window.consent_now = Date.now();
    $("#div_intro_dems").show();
}

function aborted() {
    $("#consent").hide();
    window.scrollTo(0, 0);
    window.consent_now = Date.now();
    console.log('Experiment aborted!');
    $("#abort_div").show();
}

let once_asked = false;

function validate_form(form_class) {
    if (once_asked === true || (
            $('input[name=gender]:checked').val() != undefined &&
            $("#age").val() != '' &&
            $("#country").val() != '')) {
        $("#div_intro_dems").hide();
        open_fulls();
        console.log('consented');
        window.scrollTo(0, 0);
        dem_data = [subject_id,
            condition,
            yes_key,
            $('input[name=gender]:checked').val(),
            $("#age").val(),
            $("#country").val(),
            browser[0],
            browser[1]
        ].join('/');
        console.log(dem_data);
        nextblock();
    } else {
        once_asked = true;
        alert("Du hast nicht alle Demografische Daten angegeben.");
    }
}

function demson() {}

function rchoice(array) {
    return array[Math.floor(array.length * Math.random())];
}

let subject_id =
    rchoice("CDFGHJKLMNPQRSTVWXZ") +
    rchoice("AEIOUY") +
    rchoice("CDFGHJKLMNPQRSTVWXZ") + '_' + neat_date();

//let images = {};


window.params = new URLSearchParams(location.search);
let studcod = params.get('a');

let dem_data;

function ending() {
    document.getElementById('Bye').style.display = 'block';
    let duration_full = Math.round((Date.now() - consent_now) / 600) / 100;
    full_data += 'dems\t' + [
            'subject_id',
            'condition',
            'yes_key_condition',
            'gender',
            'age',
            'country',
            'browser_name',
            'browser_version',
            'full_dur',
            'user_id'
        ].join('/') +
        '\t' + [
            subject_id,
            condition,
            yes_key,
            $('input[name=gender]:checked').val(),
            $("#age").val(),
            $("#country").val(),
            browser[0],
            browser[1],
            duration_full,
            studcod
        ].join('/');
    window.f_name =
        experiment_title +
        "_" +
        subject_id +
        "_" +
        condition +
        "_" + studcod +
        ".txt";
    upload();
}

function upload() {
    $.post(
            "store_finish.php", {
                filename_post: f_name,
                results_post: full_data,
                sid_post: subject_id,
                cond_post: 99
            },
            function(resp) {
                console.log(resp);
                if (resp.startsWith("Fail") || resp.startsWith("Warning")) {
                    $('#div_end_error').show();
                    $("#passw_display").html('EIN FEHLER IST AUFGETRETEN! Bitte schließe die Seite NICHT und sende deine Ergebnisdaten, wenn möglich, an lkcsgaspar@gmail.com, zusammen mit folgendem Code: ' + studcod);
                } else {
                    let backlink = 'https://labs-univie.sona-systems.com/webstudy_credit.aspx?experiment_id=1001&credit_token=1e4f14a94e804d7db18d9a28ea8fffe7&survey_code=' + studcod;
                    $("#passw_display").html('<a href=' + backlink + ' target="_blank">' + backlink + '</a>');
                }
            }
        )
        .fail(function(xhr, status, error) {
            console.log(xhr);
            console.log(error);
            $('#div_end_error').show();
            $("#passw_display").html('EIN FEHLER IST AUFGETRETEN! Bitte schließe die Seite NICHT und sende deine Ergebnisdaten, wenn möglich, an lkcsgaspar@gmail.com, zusammen mit folgendem Code: ' + studcod);
        });
}

function dl_as_file() {
    let blobx = new Blob([full_data], {
        type: 'text/plain'
    });
    let elemx = window.document.createElement('a');
    elemx.href = window.URL.createObjectURL(blobx);
    elemx.download = f_name;
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
}

let browser = (function() {
    let ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M;
})();


// texts to display before blocks

let block_texts = [];

function set_block_texts() {
    block_texts.push(`
        Du hast die Übungsrunde erfolgreich beendet! Nun beginnt der erste der beiden Experimentalblöcke. Die Aufgabe bleibt gleich, aber die Wörter sind eingefärbt. Zur Erinnerung:<br>
        <br>
        Drücke <b>"<span class="key_yes"></span>"</b>, wenn Target und Kategoriewort zur <b>selben Kategorie</b> gehören.<br>Drücke <b>"<span class="key_no"></span>"</b>, wenn Target und Kategoriewort <b>nicht zur selben Kategorie</b> gehören.
        <br>
        <br>
        Bitte antworte sowohl schnell als auch korrekt.
    `);
    block_texts.push(`
        Sehr gut! Du kannst gern eine kleine Pause machen, bevor es mit dem letzten Experimentalblock weitergeht.<br><br>Die Aufgabe bleibt gleich.<br><br>Zur Erinnerung:<br>
        <br>
        Drücke <b>"<span class="key_yes"></span>"</b>, wenn Target und Kategoriewort zur <b>selben Kategorie</b> gehören.<br>Drücke <b>"<span class="key_no"></span>"</b>, wenn Target und Kategoriewort <b>nicht zur selben Kategorie</b> gehören.
        <br>
        <br>
        Bitte antworte sowohl schnell als auch korrekt.
    `);
    block_texts.push(`
        Vielen Dank! Die Experimentalblöcke sind nun vorbei. Zum Schluss testen wir noch deine Sehfähigkeit (Rot-Grün-Unterscheidung).
        <br>
        Du wirst 3 Bilder mit Zahlen sehen. Bitte gib in das Textfeld die Nummer ein, die du auf dem jeweiligen Bild siehst.
    `);
}


// stimulus sequence generation
/*
function names_to_dicts(thefilenames) {
    let dict_list = [];
    let abbr_dict = {
        'p': 'positive',
        'n': 'negative'
    };
    shuffle(thefilenames).forEach((fname) => {
        let bits;
        let newdict = {
            'file': fname
        };
        fname = fname.slice(0, -4);
        let splitted;
        if (fname.indexOf("_p_") !== -1) {
            newdict.valence = 'positive';
            splitted = fname.split("_p_");
        } else {
            newdict.valence = 'negative';
            splitted = fname.split("_n_");
        }
        newdict.name = splitted[0];
        newdict.color = splitted[1];
        dict_list.push(newdict);
    });
    return dict_list;
}
*/

// the task

let teststim,
    incorrect = 0,
    block_trialnum,
    rt_data_dict,
    trial_stim,
    keys_code = 'NA';
let can_start = false;

let correct_key = "none";
let blocknum = 1;
let rt_start = 99999;
let stim_start = 0;
let listen = false;

// before isi
function fix_display() {
    $('#stimulus').css('font-weight', 'normal');
    $('#stimulus').html('+'.fontcolor('#000000'));
    console.log('after show fix before fix__display');
    console.log('you should see + for .1 s');
    setTimeout(function() {
        $('#stimulus').html('');
        $('#stimulus').css('font-weight', 'normal');
        isi();
    }, 100);
}

let isi_delay;
function isi() {
    isi_delay = randomdigit(1, isi_delay_minmax[1] - isi_delay_minmax[0]);
    console.log(isi_delay);
    setTimeout(function() {
        prime_display(trial_stim.prime.fontcolor('#808080'));
    }, isi_delay);
}

function prime_display(stim_name) {
    $('#stimulus').html(stim_name.fontcolor(trial_stim.color));
    console.log(stim_name,'stim displayed');
    setTimeout(function() {
        stim_display(trial_stim.target);
    }, 500);
}

function stim_display(stim_name) {
    if (trial_stim.prime_cat == trial_stim.target_cat) {
        correct_key = yes_key;
    } else {
        correct_key = no_key;
    }
    console.log('correct key: ', correct_key);
    $('#stimulus').html(stim_name.fontcolor(trial_stim.color));
    stim_start = now();
    listen = true;
    response_window = setTimeout(function() {
                rt_start = now() - stim_start;
                listen = false;
                flash_too_slow();
            }, response_deadline);
    console.log(stim_name,'stim displayed');
}

// too slow
function flash_too_slow() {
    $("#tooslow").show();
    setTimeout(function() {
        $("#tooslow").hide();
        tooslow = 1;
        keys_code = "x";
        add_response();
    }, tooslow_delay);
}

// false
function flash_false() {
    $("#false").show();
    setTimeout(function() {
        $("#false").hide();
        incorrect = 1;
        add_response();
    }, false_delay);
}

function practice_eval() { // TODO
    let min_ratio;
    min_ratio = 0.8;
    let is_valid = true;
    let types_failed = [];
    for (let it_type in rt_data_dict) {
        let rts_correct = $.grep(rt_data_dict[it_type], function(rt_item) {
            return rt_item > 150;
        });
        corr_ratio = rts_correct.length / rt_data_dict[it_type].length;
        if (corr_ratio < min_ratio) {
            is_valid = false;
            types_failed.push(
                " " +
                it_type +
                " Bilder (" +
                Math.floor(corr_ratio * 10000) / 100 +
                '% korrekt)'
            );
        }
    }
    if (is_valid == false) {
        let feedback_text =
            "Du musst die Übungsrunde wiederholen, da du zu wenig korrekte Antworten hattest.<br><br>Zur Erinnerung siehst du unten noch einmal die Instruktionen.<br><hr>";
        $("#feedback_id").html(feedback_text);
    }
    return is_valid;
}

let warn_set;

function next_trial() {
    console.log('started next_trial function');
    if (teststim.length > 0) {
        trial_stim = teststim.shift();
        block_trialnum++;
        //isi();
        fix_display();
    } else {
        $('#stimulus').html('');
        console.log('about to start the first trial i guess. reset stim_text to blank');
        if ((crrnt_phase !== 'practice') || (practice_eval())) {
            blocknum++;
            $("#infotext").html(block_texts.shift());
            $("#feedback_id").text('');
            nextblock();
        } else {
            nextblock();
        }
    }
}

let full_data = ["subject_id", "phase", "block_number", "trial_number", "resp_number", "prime", "prime_category", "target", "target_category", "target_wordtype" ,"color", "response_key", "rt_start", "incorrect", "isi", "date_in_ms"].join('\t') + '\n';

let resp_num = 1;

function add_response() {
    let curr_type = trial_stim.target_cat;
    if (!(curr_type in rt_data_dict)) {
        rt_data_dict[curr_type] = [];
    }
    if (resp_num == 1) {
        if (incorrect == 1) {
            rt_data_dict[curr_type].push(-1);
        } else {
            rt_data_dict[curr_type].push(rt_start);
        }
    }
    full_data += [subject_id,
        crrnt_phase,
        blocknum,
        block_trialnum,
        resp_num,
        trial_stim.prime,
        trial_stim.prime_cat,
        trial_stim.target,
        trial_stim.target_cat,
        trial_stim.word_type,
        trial_stim.color,
        keys_code,
        rt_start,
        incorrect,
        isi_delay + isi_delay_minmax[0],
        String(new Date().getTime())
    ].join('\t') + '\n';
    rt_start = 99999;
    keys_code = "NA";
    if (incorrect == 0) {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        resp_num = 1;
        next_trial();
    } else {
        incorrect = 0;
        listen = true;
        resp_num++;
    }
}

let crrnt_phase;
let prc_num = 0;

function nextblock() {
    document.documentElement.style.cursor = 'auto';
    if (blocknum <= 3) {
        block_trialnum = 0;
        if (blocknum == 1) {
            crrnt_phase = 'practice';
            //teststim = names_to_dicts(stim_practice[prc_num]);
            teststim = stim_practice[prc_num];
            prc_num++;
            if (prc_num >= stim_practice.length) {
                prc_num = 0;
                console.log('Practice reset to zero!');
            }
        } else if (blocknum == 2) {
            crrnt_phase = 'experiment_b1';
            //teststim = get_main(stim_main1);
            teststim = stim_main1;

        } else {
            crrnt_phase = 'experiment_b2';
            teststim = stim_main2;
        }
        // teststim = teststim.slice(-6);
        rt_data_dict = {};
        $("#div_stimdisp").hide();
        $('.key_yes').text(yes_key.toUpperCase());
        $('.key_no').text(no_key.toUpperCase());
        $('.prime_con').text(c_prime.toUpperCase());
        $("#intro").show();
    } else {
        document.body.style.backgroundColor = '#ccc';
        $("#div_stimdisp").hide();
        ending();
        close_fulls();
        $("#Bye").show();
    }
}

function runblock() {
    $("#intro").hide();
    $("#start_text").show();
    $("#div_stimdisp").show();
    document.documentElement.style.cursor = 'none';
    window.scrollTo(0, 0);
    can_start = true;
}


function get_main(thefilenams) {
    console.log('get_main()');
    let blck_itms_temp = names_to_dicts(thefilenams);
    blck_itms_temp = shuffle(blck_itms_temp); // shuffle it, why not
    let safecount = 0; // just to not freeze the app if sth goes wrong
    let stim_dicts_f = []; // in here the final list of dictionary items is collected, one by one
    while (blck_itms_temp.length > 0) { // stop if all items from blck_itms_temp were use up
        let dict_item = blck_itms_temp[0];
        safecount++;
        if (safecount > 9911) {
            console.log('break due to unfeasable safecount');
            break;
        }
        let good_indexes = []; // will collect the indexes where the dict item may be inserted
        let dummy_dict = [{
            'item': '-',
            'type': '-'
        }]; // dummy dict to the end
        let stim_dicts_f_d = stim_dicts_f.concat(dummy_dict);
        stim_dicts_f_d.forEach((f_item, f_index) => {
            if (!diginto_dict(stim_dicts_f, f_index, 'name', 20).includes(dict_item.name)) {
                good_indexes.push(f_index); // if fine, do add as good index
            }
        });
        if (good_indexes.length == 0) {
            if (safecount > 99) {
                console.log('no good_indexes - count', safecount);
            }
            blck_itms_temp = shuffle(blck_itms_temp); // reshuffle
        } else { // if there are good places, choose one randomly, insert the new item, and remove it from blck_itms_temp
            stim_dicts_f.splice(rchoice(good_indexes), 0, blck_itms_temp.shift());
        }
    }
    console.log('safe count:', safecount);
    return (stim_dicts_f); // return final list (for blck_items let assignment)
}


function diginto_dict(dcts, indx, key_name, min_dstnc) {
    let strt;
    if (indx - min_dstnc < 0) { // if starting index is negative, it counts from the end of the list; thats no good
        strt = 0; // so if negative, we just set it to 0
    } else {
        strt = indx - min_dstnc; // if not negative, it can remain the same
    }
    let all_vals = dcts.slice(strt, indx + min_dstnc).map(a => a[key_name]);
    return (all_vals); // return all values for the specified dict key within the specified distance (from the specified dictionary)
}

$(document).ready(function() {
    $(document).keyup(function(es) {
        if (can_start === true && (es.code == 'Space' || es.keyCode == 32)) {
            can_start = false;
            $("#start_text").hide();
            next_trial();
        }
    });
    $(document).keydown(function(e) {
        if (listen === true) {
            rt_start = now() - stim_start;
            keys_code = e.key;
            if (['e', 'i'].includes(keys_code)) {
                clearTimeout(response_window);
                listen = false;
                if (keys_code == correct_key) {
                    add_response();
                } else {
                    flash_false();
                    //incorrect = 1;
                    //add_response();
                }
            }
        }
    });
});

let countrs = ["Österreich", "Afghanistan", "Albanien", "Algerien", "Andorra", "Angola", "Antigua und Barbuda", "Argentinien", "Armenien", "Aserbaidschan", "Australien", "Bahamas", "Bahrain", "Bangladesch", "Barbados", "Belarus", "Belgien", "Belize", "Benin", "Bhutan", "Bolivien", "Bosnien und Herzegowina", "Botswana", "Brasilien", "Brunei", "Bulgarien", "Burkina Faso", "Burma", "Burundi", "Chile", "China", "Costa Rica", "Deutschland", "Dominica", "Dominikanische Republik", "Dschibuti", "Dänemark", "Ecuador", "El Salvador", "Elfenbeinküste", "Eritrea", "Estland", "Fidschi", "Finnland", "Frankreich", "Gabun", "Gambia", "Georgien", "Ghana", "Grenada", "Griechenland", "Guatemala", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hongkong", "Indien", "Indonesien", "Irak", "Iran", "Irland", "Island", "Israel", "Italien", "Jamaika", "Japan", "Jemen", "Jordanien", "Kambodscha", "Kamerun", "Kanada", "Kap Verde", "Kasachstan", "Katar", "Kenia", "Kirgisistan", "Kiribati", "Kolumbien", "Komoren", "Kongo", "Kosovo", "Kroatien", "Kuba", "Kuwait", "Laos", "Lesotho", "Lettland", "Libanon", "Liberia", "Libyen", "Liechtenstein", "Litauen", "Luxemburg", "Macau", "Madagaskar", "Malawi", "Malaysia", "Malediven", "Mali", "Malta", "Marokko", "Marshallinseln", "Mauretanien", "Mauritius", "Mazedonien", "Mexiko", "Mikronesien", "Moldawien", "Monaco", "Mongolei", "Montenegro", "Mosambik", "Namibia", "Nauru", "Nepal", "Neuseeland", "Nicaragua", "Niederlande", "Niger", "Nigeria", "Nordkorea", "Norwegen", "Oman", "Pakistan", "Palau", "Panama", "Papua-Neuguinea", "Paraguay", "Peru", "Philippinen", "Polen", "Portugal", "Ruanda", "Rumänien", "Russland", "Salomonen", "Sambia", "Samoa", "San Marino", "Saudi-Arabien", "Schweden", "Schweiz", "Senegal", "Serbien", "Seychellen", "Sierra Leone", "Simbabwe", "Singapur", "Slowakei", "Slowenien", "Somalia", "Spanien", "Sri Lanka", "St. Kitts und Nevis", "St. Lucia", "St. Vincent", "Sudan", "Surinam", "Swasiland", "Syrien", "São Tomé und Príncipe", "Südafrika", "Südkorea", "Südsudan", "Tadschikistan", "Taiwan", "Tansania", "Thailand", "Timor Leste", "Togo", "Tonga", "Trinidad und Tobago", "Tschad", "Tschechische Republik", "Tunesien", "Turkmenistan", "Tuvalu", "Türkei", "Uganda", "Ukraine", "Ungarn", "Uruguay", "Usbekistan", "Vanuatu", "Vatikanstadt", "Venezuela", "Vereinigte Arabische Emirate", "Vereinigte Staaten", "Vereinigtes Königreich", "Vietnam", "Zentralafrikanische Republik", "Zypern", "Ägypten", "Äquatorialguinea", "Äthiopien"];
