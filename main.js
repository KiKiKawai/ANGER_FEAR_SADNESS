/*jshint esversion: 6 */

let experiment_title = 'anger_fear';
//let img_ishi = ["1.png", "2.png", "3.png"];
let response_deadline = 1500;
let tooslow_delay = 500;
let false_delay = 500;
let basic_times = {};
let isi_delay_minmax = [300, 400];
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
        //open_fulls();
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
        $("#ishihara").show();
        //nextblock();
    } else {
        once_asked = true;
        alert("Du hast nicht alle Demografische Daten angegeben.");
    }
}

function ishi_eval() {
    if (
        $("#n1").val() == '12' &&
        $("#n2").val() == '6' &&
        $("#n3").val() == '42' ){
        open_fulls();
        $("#ishihara").hide();
        window.scrollTo(0, 0);
        nextblock();
        }
     else {
         window.scrollTo(0, 0);
         console.log('Experiment aborted [ISHI]');
         $("#ishihara").hide();
         $("#abort_div").show();
         $("#abort_div").html("<h2>Experiment abgebrochen.</h2><br><br><br>Das Ergebnis deines Sehtests ist nicht eindeutig. Da die Fähigkeit zur Rot-Grün-Unterscheidung wesentlich für das Experiment ist, kannst du nicht an dieser Studie teilnehmen. Wir entschuldigen uns für die Umstände und hoffen auf dein Verständnis.");
         full_data += '\n' + 'xxxxx'.repeat(100) + '\n';
         ending();
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
    close_fulls();
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
        Du hast die Übungsrunde beendet! Nun beginnt der erste der beiden Experimentalblöcke. Die Aufgabe bleibt gleich, aber die Wörter sind eingefärbt. Zur Erinnerung:<br>
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
    tooslow = 0,
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
    setTimeout(function() {
        $('#stimulus').html('');
        $('#stimulus').css('font-weight', 'bold');
        isi();
    }, 500);
}

let isi_delay;
function isi() {
    isi_delay = randomdigit(isi_delay_minmax[0], isi_delay_minmax[1]);
    setTimeout(function() {
        prime_display(trial_stim.prime.fontcolor('#777777'));
    }, isi_delay);
}

function prime_display(stim_name) {
    $('#stimulus').html(stim_name.fontcolor(trial_stim.color));
    setTimeout(function() {
        $('#stimulus').html('');
        blankit();
        //stim_display(trial_stim.target);
    }, 500);
}

function blankit() {
    setTimeout(function() {
        //$('#stimulus').html('');
        stim_display(trial_stim.target);
    }, 300); // 400 - 100
}

function stim_display(stim_name) {
    if (trial_stim.prime_cat == trial_stim.target_cat) {
        correct_key = yes_key;
    } else {
        correct_key = no_key;
    }
    //console.log('correct key: ', correct_key);

    window.warmup_needed = true;
    chromeWorkaroundLoop();
    setTimeout(function() {
        $('#stimulus').html(stim_name.fontcolor(trial_stim.color));
        requestPostAnimationFrame(function() {
            stim_start = now();
            warmup_needed = false;
            listen = true;
            response_window = setTimeout(function() {
                rt_start = now() - stim_start;
                listen = false;
                flash_too_slow();
            }, response_deadline);
        });
    }, 100);
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
    console.log('Number of Mistakes = ', mistakes.length );
    let is_valid = true;
    if (mistakes.length > 4 && stim_practice[2].length != 0) {
        is_valid = false;
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
    if (teststim.length > 0) {
        trial_stim = teststim.shift();
        block_trialnum++;
        //isi();
        fix_display();
    } else {
        $('#stimulus').html('');
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

let full_data = ["subject_id", "phase", "block_number", "trial_number", "resp_number", "prime", "prime_category", "target", "target_category", "target_wordtype", "color", "response_key", "rt_start", "incorrect", "isi", "date_in_ms"].join('\t') + '\n';

let resp_num = 1;
let mistakes = [];

function add_response() {
    let curr_type = trial_stim.target;
    if (resp_num == 1){
        if (incorrect == 1 || tooslow == 1) {
            mistakes.push(curr_type);
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
        isi_delay,
        String(new Date().getTime())
    ].join('\t') + '\n';
    rt_start = 99999;
    keys_code = "NA";
    if (incorrect == 0) {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        resp_num = 1;
        tooslow = 0;
        next_trial();
    } else {
        incorrect = 0;
        tooslow = 0;
        listen = true;
        resp_num++;
    }
}

let crrnt_phase;
let prc_num = 0;

function nextblock() {
    document.documentElement.style.cursor = 'auto';
    mistakes = [];
    if (blocknum <= 3) {
        block_trialnum = 0;
        if (blocknum == 1) {
            crrnt_phase = 'practice';
            teststim = stim_practice[prc_num];
            prc_num++;
            if (prc_num >= stim_practice.length) {
                prc_num = 0;
                console.log('Practice reset to zero!');
            }
        } else if (blocknum == 2) {
            crrnt_phase = 'experiment_b1';
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
        document.getElementById('Bye').style.display = 'block';
        ending();
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



// item display timing
function monkeyPatchRequestPostAnimationFrame() {
    const channel = new MessageChannel();
    const callbacks = [];
    let timestamp = 0;
    let called = false;
    channel.port2.onmessage = e => {
        called = false;
        const toCall = callbacks.slice();
        callbacks.length = 0;
        toCall.forEach(fn => {
            try {
                fn(timestamp);
            } catch (e) {}
        });
    };
    window.requestPostAnimationFrame = function(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Argument 1 is not callable');
        }
        callbacks.push(callback);
        if (!called) {
            requestAnimationFrame((time) => {
                timestamp = time;
                channel.port1.postMessage('');
            });
            called = true;
        }
    };
}

if (typeof requestPostAnimationFrame !== 'function') {
    monkeyPatchRequestPostAnimationFrame();
}

function chromeWorkaroundLoop() {
    if (warmup_needed) {
        requestAnimationFrame(chromeWorkaroundLoop);
    }
}
